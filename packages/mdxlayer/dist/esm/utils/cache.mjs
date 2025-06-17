import fs from 'node:fs';
import path from 'node:path';
import { transformFile } from './transform.mjs';

const readCache = () => {
  const cachePath = path.resolve(process.cwd(), `.mdxlayer/cache`, `data.json`);
  if (!fs.existsSync(cachePath)) return {};
  return JSON.parse(fs.readFileSync(cachePath, "utf8"));
};
const updateCache = (item) => transformFile({
  doc: { ...readCache(), ...item },
  filename: "data.json",
  subpath: "cache"
});

export { readCache, updateCache };
