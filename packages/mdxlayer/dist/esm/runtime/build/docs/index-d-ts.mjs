import { readCache, updateCache } from '../../../utils/cache.mjs';
import { toHashNumber } from '../../../utils/hash.mjs';
import { transformFile } from '../../../utils/transform.mjs';

const toIndexDts = (exp, docType) => {
  const content = `import type { ${docType} } from './types';

export * from './types';
${Object.keys(exp).map((impName) => `export declare const ${impName}: ${docType}[];`).join("\n")}`;
  const newSig = toHashNumber(content);
  const cache = readCache();
  const isChanged = cache.indexDtsSig !== newSig;
  if (isChanged) {
    transformFile({
      doc: content,
      filename: "index.d.ts",
      subpath: "generated"
    });
    updateCache({ ...cache, indexDtsSig: newSig });
  }
};

export { toIndexDts };
