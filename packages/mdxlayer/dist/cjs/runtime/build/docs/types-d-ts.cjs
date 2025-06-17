'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const fs = require('node:fs');
const path = require('node:path');
const transform = require('../../../utils/transform.cjs');

const toTypesDts = (types) => {
  const typesPath = path.resolve(process.cwd(), ".mdxlayer", "types.d.ts");
  const isChanged = !fs.existsSync(typesPath);
  if (isChanged) {
    transform.transformFile({
      doc: types,
      filename: "types.d.ts",
      subpath: "generated"
    });
  }
};

exports.toTypesDts = toTypesDts;
