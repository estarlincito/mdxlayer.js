/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

import fg from 'fast-glob';
import matter from 'gray-matter';

import { cache } from '@/cache/index.js';
import { getUserConfig } from '@/config/index.js';
import type { Doc } from '@/types/index.js';
import { transformFile } from '@/utils/transform.js';

import { toIndexMjs } from './docs/index-mjs.js';
import { toPackageJson } from './docs/package-json.js';
import { toTypesDts } from './docs/types-d-ts.js';

export const builder = async () => {
  const {
    changed,
    contentDir = 'contents',
    docType = 'Contents',
    resolvedFields,
    frontmatterSchema,
  } = await getUserConfig();

  const cwd = process.cwd();
  const filesUpdated = new Set<string>();
  const dir = path.resolve(cwd, contentDir.replace(/^(\.\/|\/)+/, ''));
  const files = await fg(['**/*.mdx'], { cwd: dir });
  // Checking files
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const isChanged = cache.mtime(fullPath);

    if (isChanged || changed) {
      const raw = fs.readFileSync(fullPath, 'utf8');

      const { data, content } = matter(raw);
      // Parsing frontmatterSchema
      const parsed = frontmatterSchema.safeValidate(data);

      if (!parsed.success) {
        console.error(`❌ Invalid ${docType} frontmatter:`, parsed.error);
        process.exit(1);
      }

      // Generating doc
      const filename = file.replace(/\.mdx$/, '');
      const doc: Doc = {
        _id: path.basename(filename),
        ...data,
        _body: { raw: content },
        _filePath: fullPath,
      };

      // Resolving fields
      if (resolvedFields) {
        for (const [key, { resolve }] of Object.entries(resolvedFields)) {
          doc[key] = resolve(doc);
        }
      }

      // Saving content from mdx
      transformFile({
        doc,
        filename: `${filename}.json`,
        subpath: `generated/${docType}`,
      });

      if (!filesUpdated.has(fullPath)) filesUpdated.add(fullPath);
    }
  });

  const count = filesUpdated.size;

  // ading types.d.ts
  toTypesDts({ docType, frontmatterSchema, resolvedFields });
  // ading index.mjs and index.cjs
  toIndexMjs(files, docType);
  // ading package.json
  toPackageJson();

  if (count > 0) {
    console.log(`✅ MDXLayout built: ${count} items`);
  }
};
