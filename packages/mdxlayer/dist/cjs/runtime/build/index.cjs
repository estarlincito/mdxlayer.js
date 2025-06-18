'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const fs = require('node:fs');
const path = require('node:path');
const fg = require('fast-glob');
const matter = require('gray-matter');
const cache = require('../../utils/cache.cjs');
const changes = require('../../utils/changes.cjs');
const transform = require('../../utils/transform.cjs');
const indexMjs = require('./docs/index-mjs.cjs');
const packageJson = require('./docs/package-json.cjs');
const typesDTs = require('./docs/types-d-ts.cjs');

const build = async ({
  contentDir = "contents",
  docType = "Contents",
  resolvedFields,
  frontmatterSchema
}) => {
  const cwd = process.cwd();
  const filesUpdated = /* @__PURE__ */ new Set();
  const dir = path.resolve(cwd, contentDir.replace(/^(\.\/|\/)+/, ""));
  const files = await fg(["**/*.mdx"], { cwd: dir });
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const { isChanged, mtimeMs } = changes.checkForChanges(fullPath);
    if (isChanged) {
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(raw);
      const parsed = frontmatterSchema.safeValidate(data);
      if (!parsed.success) {
        console.error(`❌ Invalid ${docType} frontmatter:`, parsed.error);
        process.exit(1);
      }
      const resolved = {};
      if (resolvedFields) {
        for (const [key, { resolve }] of Object.entries(resolvedFields)) {
          resolved[key] = resolve(data);
        }
      }
      const filename = file.replace(/\.mdx$/, "");
      const doc = {
        _id: filename,
        ...data,
        ...resolved,
        _body: { raw: content },
        _filePath: fullPath
      };
      transform.transformFile({
        doc,
        filename: `${filename}.json`,
        subpath: `generated/${docType}`
      });
      cache.updateCache({ [fullPath]: mtimeMs });
      if (!filesUpdated.has(fullPath)) filesUpdated.add(fullPath);
    }
  });
  const count = filesUpdated.size;
  typesDTs.toTypesDts({ docType, frontmatterSchema, resolvedFields });
  indexMjs.toIndexMjs(files, docType);
  packageJson.toPackageJson();
  if (count > 0) {
    console.log(`✅ MDXLayout built: ${count} items`);
  }
};

exports.build = build;
