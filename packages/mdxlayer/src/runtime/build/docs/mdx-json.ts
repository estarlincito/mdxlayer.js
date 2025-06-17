/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import type { Config, Doc } from '@/types.js';
import { updateCache } from '@/utils/cache.js';
import { checkForChanges } from '@/utils/changes.js';
import { transformFile } from '@/utils/transform.js';

interface ToMdxJson
  extends Pick<Config, 'docType' | 'frontmatterSchema' | 'resolvedFields'> {
  files: string[];
  dir: string;
}
const filesUpdated = new Set<string>();

export const toMdxJson = ({
  docType,
  resolvedFields,
  frontmatterSchema,
  files,
  dir,
}: ToMdxJson) => {
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const { isChanged, mtimeMs } = checkForChanges(fullPath);

    if (isChanged) {
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(raw);
      // Parsing frontmatterSchema
      const parsed = frontmatterSchema.safeValidate(data);

      if (!parsed.success) {
        console.error(`❌ Invalid ${docType} frontmatter:`, parsed.error);
        process.exit(1);
      }
      // Resolving fields
      const resolved: Record<string, any> = {};
      if (resolvedFields) {
        for (const [key, { resolve }] of Object.entries(resolvedFields)) {
          resolved[key] = resolve(data);
        }
      }

      // Generating doc
      const filename = file.replace(/\.mdx$/, '');
      const doc: Doc = {
        _id: filename,
        ...data,
        ...resolved,
        _body: { raw: content },
        _filePath: fullPath,
      };
      // Saving content from mdx
      transformFile({
        doc,
        filename: `${filename}.json`,
        subpath: `generated/${docType}`,
      });

      // Updating cache
      updateCache({ [fullPath]: mtimeMs });
      if (!filesUpdated.has(fullPath)) filesUpdated.add(fullPath);
    }
  });

  const count = filesUpdated.size;

  if (count > 0) {
    console.log(`✅ MDXLayout built: ${count} items`);
  }
};
