'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const fs = require('node:fs');
const path = require('node:path');
const transform = require('../../../utils/transform.cjs');

const toIndexDts = (exp, docType) => {
  const content = `import type { ${docType} } from './types';

export * from './types';
${Object.keys(exp).map((impName) => `export declare const ${impName}: ${docType}[];`).join("\n")}`;
  const indexPath = path.resolve(process.cwd(), ".mdxlayer", "index.d.ts");
  const isChanged = !fs.existsSync(indexPath);
  if (isChanged) {
    transform.transformFile({
      doc: content,
      filename: "index.d.ts",
      subpath: "generated"
    });
  }
};

exports.toIndexDts = toIndexDts;
