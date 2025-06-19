import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { cache } from '../cache/index.mjs';
import { getUserConfig } from '../config/index.mjs';
import { transformFile } from '../utils/transform.mjs';
import { toIndexMjs } from './docs/index-mjs.mjs';
import { toPackageJson } from './docs/package-json.mjs';
import { toTypesDts } from './docs/types-d-ts.mjs';

const builder = async () => {
  const {
    changed,
    contentDir = "contents",
    docType = "Contents",
    resolvedFields,
    frontmatterSchema
  } = await getUserConfig();
  const cwd = process.cwd();
  const filesUpdated = /* @__PURE__ */ new Set();
  const dir = path.resolve(cwd, contentDir.replace(/^(\.\/|\/)+/, ""));
  const files = await fg(["**/*.mdx"], { cwd: dir });
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const isChanged = cache.mtime(fullPath);
    if (isChanged || changed) {
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(raw);
      const parsed = frontmatterSchema.safeValidate(data);
      if (!parsed.success) {
        console.error(`❌ Invalid ${docType} frontmatter:`, parsed.error);
        process.exit(1);
      }
      const filename = file.replace(/\.mdx$/, "");
      const doc = {
        _id: path.basename(filename),
        ...data,
        _body: { raw: content },
        _filePath: fullPath
      };
      if (resolvedFields) {
        for (const [key, { resolve }] of Object.entries(resolvedFields)) {
          doc[key] = resolve(doc);
        }
      }
      transformFile({
        doc,
        filename: `${filename}.json`,
        subpath: `generated/${docType}`
      });
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

export { builder };
