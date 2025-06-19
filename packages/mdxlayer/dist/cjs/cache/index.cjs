'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const fs = require('node:fs');
const path = require('node:path');
const hash = require('../utils/hash.cjs');
const transform = require('../utils/transform.cjs');

const get = () => {
  const cachePath = path.resolve(process.cwd(), `.mdxlayer/cache`, `data.json`);
  if (!fs.existsSync(cachePath)) return {};
  return JSON.parse(fs.readFileSync(cachePath, "utf8"));
};
const set = (item) => transform.transformFile({
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
  const sig = hash.hash.number(content);
  const isChanged = hash.hash.number(content) !== cache.get()[key];
  if (isChanged) cache.set({ [key]: sig });
  return isChanged;
};
const cache = {
  changed,
  get,
  mtime,
  set
};

exports.cache = cache;
