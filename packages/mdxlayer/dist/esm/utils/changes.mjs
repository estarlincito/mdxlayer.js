import fs from 'node:fs';
import { readCache } from './cache.mjs';

const checkForChanges = (fullPath) => {
  const cache = readCache();
  const { mtimeMs } = fs.statSync(fullPath);
  return { isChanged: cache[fullPath] !== mtimeMs, mtimeMs };
};

export { checkForChanges };
