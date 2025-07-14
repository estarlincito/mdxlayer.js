/* eslint-disable safeguard/no-raw-error */
/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

import fg from 'fast-glob';
import matter from 'gray-matter';

import { cache } from '@/cache/index.js';
import { getUserConfig } from '@/config/index.js';
import { processMDX } from '@/plugin/index.js';
import type { Doc } from '@/types/index.js';
import { transformFile } from '@/utils/transform.js';

import { toIndexMjs } from './docs/index-js.js';
import { toPackageJson } from './docs/package.js';
import { toTypesDts } from './docs/types-d.js';

export const builder = async () => {
  const {
    changed,
    contentDir = 'content',
    docType = 'Content',
    resolvedFields,
    frontmatterSchema,
    options,
  } = await getUserConfig();

  const cwd = process.cwd();
  const dir = path.resolve(cwd, contentDir.replace(/^(\.\/|\/)+/, ''));
  const files = await fg(['**/*.mdx'], { cwd: dir });

  // Track processing stats
  let processedCount = 0;
  let errorCount = 0;

  // Process files in parallel
  const processingPromises = files.map(async (file) => {
    const fullPath = path.join(dir, file);
    const isChanged = cache.mtime(fullPath);

    if (!isChanged && !changed) {
      return; // Skip unchanged files
    }

    try {
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(raw);

      // Validate frontmatter
      const parsed = frontmatterSchema.safeValidate(data);
      if (!parsed.success) {
        throw new Error(
          `Invalid ${docType} frontmatter in ${file}: ${!parsed.error}`,
        );
      }

      // Process markdown to code
      const code = await processMDX(options, content);

      // Generate document
      const filename = file.replace(/\.mdx$/, '');
      const doc: Doc = {
        _id: path.basename(filename),
        ...data,
        _body: { code, raw: content },
        _filePath: fullPath,
      };

      // Resolve custom fields
      if (resolvedFields) {
        const promises = Object.entries(resolvedFields).map(([, { resolve }]) =>
          resolve(doc),
        );

        const results = await Promise.all(promises);

        results.forEach((value, i) => {
          const key = Object.keys(resolvedFields)[i];
          doc[key] = value;
        });
      }

      // Save as JSON
      transformFile({
        doc,
        filename: `${filename}.json`,
        subpath: `generated/${docType}`,
      });

      processedCount += 1;
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err);
      errorCount += 1;
    }
  });

  // Wait for all files to process
  await Promise.all(processingPromises);

  // Generate supporting files
  toTypesDts({ docType, frontmatterSchema, resolvedFields });
  toIndexMjs(files, docType);
  toPackageJson();

  // Report results
  if (errorCount > 0) {
    console.error(`❌ MDXLayout completed with ${errorCount} errors`);
  } else if (processedCount > 0) {
    console.log(`✅ MDXLayout built: ${processedCount} items updated`);
  } else {
    console.log('✅ MDXLayout: No changes detected');
  }
};
