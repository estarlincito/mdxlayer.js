import fs from 'node:fs';
import path from 'node:path';
import { hash } from '../utils/hash.mjs';
import { transformFile } from '../utils/transform.mjs';

const get = () => {
  const cachePath = path.resolve(process.cwd(), `.mdxlayer/cache`, `data.json`);
  if (!fs.existsSync(cachePath)) return {};
  return JSON.parse(fs.readFileSync(cachePath, "utf8"));
};
const set = (item) => transformFile({
  doc: { ...get(), ...item },
  filename: "data.json",
  subpath: "cache"
});
const mtime = (key) => {
  const { mtimeMs } = fs.statSync(key);
  const isChanged = get()[key] !== mtimeMs;
  if (isChanged) cache.set({ [key]: mtimeMs });
  return isChanged;
};
const changed = (content, key) => {
  const sig = hash.number(content);
  const isChanged = hash.number(content) !== cache.get()[key];
  if (isChanged) cache.set({ [key]: sig });
  return isChanged;
};
const cache = {
  changed,
  get,
  mtime,
  set
};

export { cache };
