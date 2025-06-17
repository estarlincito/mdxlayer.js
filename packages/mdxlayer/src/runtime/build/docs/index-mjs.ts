import path from 'node:path';

import { readCache, updateCache } from '@/utils/cache.js';
import { toHashNumber } from '@/utils/hash.js';
import { transformFile } from '@/utils/transform.js';

import { toIndexDts } from './index-d-ts.js';

const getExpName = (file: string, docType: string) => {
  const first = path.dirname(file).split(path.sep)[0];
  const main = first === '.' ? 'all' : first;

  return main.charAt(0).toUpperCase() + main.slice(1) + docType;
};

export const toIndexMjs = (files: string[], docType: string) => {
  const newSig = toHashNumber(JSON.stringify(files));
  const cache = readCache();
  const isChanged = cache.indexSig !== newSig;

  if (isChanged) {
    const exportsMap: Record<string, string[]> = {};

    const out: {
      cjs: string[];
      esm: string[];
    } = {
      cjs: [],
      esm: [],
    };

    for (const filePath of files) {
      const filename = filePath.replace(/\.mdx$/, '');
      const impName = filename.replace(/[-.&/]/g, '_');
      const moduleName = `./${docType}/${filename}.json`;
      const expName = getExpName(filePath, docType);

      // ESM
      const esmLine = `import ${impName} from '${moduleName}' assert { type: 'json' }`;
      out.esm.push(esmLine);
      // CJS
      const cjsLine = `const ${impName} = require('${moduleName}');`;
      out.cjs.push(cjsLine);

      exportsMap[expName] ??= [];
      exportsMap[expName].push(impName);
    }

    Object.entries(exportsMap).forEach(([key, value]) => {
      const joinedValues = value.join(', ');
      // CJS
      const cjsLine = `module.exports.${key} = [${joinedValues}];`;
      out.cjs.push(cjsLine);

      // ESM
      const esmLine = `export const ${key} = [${joinedValues}];`;
      out.esm.push(esmLine);
    });

    // Generating Index.cjs
    const subpath = `generated`;

    transformFile({
      doc: out.cjs.join('\n'),
      filename: 'index.cjs',
      subpath,
    });

    // Generating Index.mjs
    transformFile({
      doc: out.esm.join('\n'),
      filename: 'index.mjs',
      subpath,
    });

    // updating cache
    updateCache({ ...cache, indexSig: newSig });

    // Generating Index.d.ts
    toIndexDts(exportsMap, docType);
  }
};
