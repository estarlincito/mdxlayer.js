import path from 'node:path';
import fg from 'fast-glob';
import { toIndexMjs } from './docs/index-mjs.mjs';
import { toMdxJson } from './docs/mdx-json.mjs';
import { toPackageJson } from './docs/package-json.mjs';
import { toTypesDts } from './docs/types-d-ts.mjs';

const cwd = process.cwd();
const build = async ({
  contentDir = "content",
  docType = "Content",
  resolvedFields,
  frontmatterSchema
}) => {
  const dir = path.resolve(cwd, contentDir.replace(/^(\.\/|\/)+/, ""));
  const files = await fg(["**/*.mdx"], { cwd: dir });
  toMdxJson({ dir, docType, files, frontmatterSchema, resolvedFields });
  toIndexMjs(files, docType);
  toTypesDts(frontmatterSchema.toDts(docType));
  toPackageJson();
};

export { build };
