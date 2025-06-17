import path from 'node:path';

import fg from 'fast-glob';

import type { Config } from '@/types.js';

import { toIndexMjs } from './docs/index-mjs.js';
import { toMdxJson } from './docs/mdx-json.js';
import { toPackageJson } from './docs/package-json.js';
import { toTypesDts } from './docs/types-d-ts.js';

const cwd = process.cwd();

export const build = async ({
  contentDir = 'content',
  docType = 'Content',
  resolvedFields,
  frontmatterSchema,
}: Config) => {
  const dir = path.resolve(cwd, contentDir.replace(/^(\.\/|\/)+/, ''));
  const files = await fg(['**/*.mdx'], { cwd: dir });

  // Generating docs
  toMdxJson({ dir, docType, files, frontmatterSchema, resolvedFields });
  toIndexMjs(files, docType);
  toTypesDts(frontmatterSchema.toDts(docType));
  toPackageJson();
};
