'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const fs = require('node:fs');
const path = require('node:path');
const transform = require('./transform.cjs');

const readCache = () => {
  const cachePath = path.resolve(process.cwd(), `.mdxlayer/cache`, `data.json`);
  if (!fs.existsSync(cachePath)) return {};
  return JSON.parse(fs.readFileSync(cachePath, "utf8"));
};
const updateCache = (item) => transform.transformFile({
  doc: { ...readCache(), ...item },
  filename: "data.json",
  subpath: "cache"
});

exports.readCache = readCache;
exports.updateCache = updateCache;
