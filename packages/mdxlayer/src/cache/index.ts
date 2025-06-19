import fs from 'node:fs';
import path from 'node:path';

import { hash } from '@/utils/hash.js';
import { transformFile } from '@/utils/transform.js';

export type Cache = Record<string, number>;

const get = (): Cache => {
  const cachePath = path.resolve(process.cwd(), `.mdxlayer/cache`, `data.json`);
  if (!fs.existsSync(cachePath)) return {};
  return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
};

const set = (item: Cache) =>
  transformFile({
    doc: { ...get(), ...item },
    filename: 'data.json',
    subpath: 'cache',
  });

const mtime = (key: string) => {
  const { mtimeMs } = fs.statSync(key);
  const isChanged = get()[key] !== mtimeMs;
  if (isChanged) cache.set({ [key]: mtimeMs });

  return isChanged;
};

const changed = (content: string, key: string) => {
  const sig = hash.number(content);
  const isChanged = hash.number(content) !== cache.get()[key];
  if (isChanged) cache.set({ [key]: sig });

  return isChanged;
};

export const cache = {
  changed,
  get,
  mtime,
  set,
};
