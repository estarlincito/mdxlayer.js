// import { toHash } from '@/utils/hash.js';
import { readCache, updateCache } from '@/utils/cache.js';
import { toHashNumber } from '@/utils/hash.js';
import { transformFile } from '@/utils/transform.js';

export const toIndexDts = (exp: Record<string, string[]>, docType: string) => {
  const content = `import type { ${docType} } from './types';\n\nexport * from './types';
${Object.keys(exp)
  .map((impName) => `export declare const ${impName}: ${docType}[];`)
  .join('\n')}`;

  const newSig = toHashNumber(content);
  const cache = readCache();
  const isChanged = cache.indexDtsSig !== newSig;

  if (isChanged) {
    transformFile({
      doc: content,
      filename: 'index.d.ts',
      subpath: 'generated',
    });

    updateCache({ ...cache, indexDtsSig: newSig });
  }
};
