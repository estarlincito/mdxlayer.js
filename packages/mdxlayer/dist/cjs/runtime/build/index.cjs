'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const path = require('node:path');
const fg = require('fast-glob');
const indexMjs = require('./docs/index-mjs.cjs');
const mdxJson = require('./docs/mdx-json.cjs');
const packageJson = require('./docs/package-json.cjs');
const typesDTs = require('./docs/types-d-ts.cjs');

const cwd = process.cwd();
const build = async ({
  contentDir = "content",
  docType = "Content",
  resolvedFields,
  frontmatterSchema
}) => {
  const dir = path.resolve(cwd, contentDir.replace(/^(\.\/|\/)+/, ""));
  const files = await fg(["**/*.mdx"], { cwd: dir });
  mdxJson.toMdxJson({ dir, docType, files, frontmatterSchema, resolvedFields });
  indexMjs.toIndexMjs(files, docType);
  typesDTs.toTypesDts(frontmatterSchema.toDts(docType));
  packageJson.toPackageJson();
};

exports.build = build;
