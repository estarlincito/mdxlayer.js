import fs from 'node:fs';

import { readCache } from './cache.js';

export const checkForChanges = (fullPath: string) => {
  const cache = readCache();
  const { mtimeMs } = fs.statSync(fullPath);

  return { isChanged: cache[fullPath] !== mtimeMs, mtimeMs };
};
