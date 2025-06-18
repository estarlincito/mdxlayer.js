'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const cache = require('../../../utils/cache.cjs');
const hash = require('../../../utils/hash.cjs');
const transform = require('../../../utils/transform.cjs');

const toIndexDts = (exp, docType) => {
  const content = `import type { ${docType} } from './types';

export * from './types';
${Object.keys(exp).map((impName) => `export declare const ${impName}: ${docType}[];`).join("\n")}`;
  const newSig = hash.toHashNumber(content);
  const cache$1 = cache.readCache();
  const isChanged = cache$1.indexDtsSig !== newSig;
  if (isChanged) {
    transform.transformFile({
      doc: content,
      filename: "index.d.ts",
      subpath: "generated"
    });
    cache.updateCache({ ...cache$1, indexDtsSig: newSig });
  }
};

exports.toIndexDts = toIndexDts;
