'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const fs = require('node:fs');
const cache = require('./cache.cjs');

const checkForChanges = (fullPath) => {
  const cache$1 = cache.readCache();
  const { mtimeMs } = fs.statSync(fullPath);
  return { isChanged: cache$1[fullPath] !== mtimeMs, mtimeMs };
};

exports.checkForChanges = checkForChanges;
