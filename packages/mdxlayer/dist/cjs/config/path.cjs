'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const fs = require('node:fs');
const path = require('node:path');

const CONFIG_FILENAMES = [
  "mdxlayer.config.ts",
  "mdxlayer.config.js",
  "mdxlayer.config.mjs",
  "mdxlayer.config.cjs",
  "mdxlayer.config.mts",
  "mdxlayer.config.cts"
];
const configPath = (() => {
  for (const filename of CONFIG_FILENAMES) {
    const fullPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  throw new Error("❌ No mdxlayer config file found.");
})();

exports.configPath = configPath;
