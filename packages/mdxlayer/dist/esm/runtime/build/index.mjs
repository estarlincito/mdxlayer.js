import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { updateCache } from '../../utils/cache.mjs';
import { checkForChanges } from '../../utils/changes.mjs';
import { transformFile } from '../../utils/transform.mjs';
import { toIndexMjs } from './docs/index-mjs.mjs';
import { toPackageJson } from './docs/package-json.mjs';
import { toTypesDts } from './docs/types-d-ts.mjs';

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
    const { isChanged, mtimeMs } = checkForChanges(fullPath);
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
      transformFile({
        doc,
        filename: `${filename}.json`,
        subpath: `generated/${docType}`
      });
      updateCache({ [fullPath]: mtimeMs });
      if (!filesUpdated.has(fullPath)) filesUpdated.add(fullPath);
    }
  });
  const count = filesUpdated.size;
  toTypesDts({ docType, frontmatterSchema, resolvedFields });
  toIndexMjs(files, docType);
  toPackageJson();
  if (count > 0) {
    console.log(`✅ MDXLayout built: ${count} items`);
  }
};

export { build };
