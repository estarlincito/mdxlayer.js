'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('../../cache/index.cjs');
const transform = require('../../utils/transform.cjs');

const toIndexDts = (exp, docType) => {
  const content = `import type { ${docType} } from './types';

export * from './types';
${Object.keys(exp).map((impName) => `export declare const ${impName}: ${docType}[];`).join("\n")}`;
  const isChanged = index.cache.changed(content, "index.d.ts");
  if (isChanged) {
    transform.transformFile({
      doc: content,
      filename: "index.d.ts",
      subpath: "generated"
    });
  }
};

exports.toIndexDts = toIndexDts;
