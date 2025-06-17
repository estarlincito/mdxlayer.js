import fs from 'node:fs';
import path from 'node:path';

import { transformFile } from '@/utils/transform.js';

export type Cache = Record<string, number>;
export const readCache = (): Cache => {
  const cachePath = path.resolve(process.cwd(), `.mdxlayer/cache`, `data.json`);
  if (!fs.existsSync(cachePath)) return {};
  return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
};

export const updateCache = (item: Cache) =>
  transformFile({
    doc: { ...readCache(), ...item },
    filename: 'data.json',
    subpath: 'cache',
  });
