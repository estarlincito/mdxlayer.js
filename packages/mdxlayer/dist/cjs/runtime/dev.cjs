'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const fs = require('node:fs');
const path = require('node:path');
const index = require('./build/index.cjs');

const dev = async (config) => {
  await index.build(config);
  const watchDir = path.resolve(process.cwd(), config.contentDir);
  fs.watch(watchDir, { recursive: true }, async (eventType, filename) => {
    if (filename?.endsWith(".mdx")) {
      console.log(`[${eventType}] ${filename}`);
      await index.build(config);
    }
  });
  console.log(`Watching MDX files in ${watchDir}`);
};

exports.dev = dev;
