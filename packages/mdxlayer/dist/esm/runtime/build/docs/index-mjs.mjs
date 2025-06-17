import path from 'node:path';
import { readCache, updateCache } from '../../../utils/cache.mjs';
import { toHashNumber } from '../../../utils/hash.mjs';
import { transformFile } from '../../../utils/transform.mjs';
import { toIndexDts } from './index-d-ts.mjs';

const getExpName = (file, docType) => {
  const first = path.dirname(file).split(path.sep)[0];
  const main = first === "." ? "all" : first;
  return main.charAt(0).toUpperCase() + main.slice(1) + docType;
};
const toIndexMjs = (files, docType) => {
  const newSig = toHashNumber(JSON.stringify(files));
  const cache = readCache();
  const isChanged = cache.indexSig !== newSig;
  if (isChanged) {
    const exportsMap = {};
    const out = {
      cjs: [],
      esm: []
    };
    for (const filePath of files) {
      const filename = filePath.replace(/\.mdx$/, "");
      const impName = filename.replace(/[-.&/]/g, "_");
      const moduleName = `./${docType}/${filename}.json`;
      const expName = getExpName(filePath, docType);
      const esmLine = `import ${impName} from '${moduleName}' assert { type: 'json' }`;
      out.esm.push(esmLine);
      const cjsLine = `const ${impName} = require('${moduleName}');`;
      out.cjs.push(cjsLine);
      exportsMap[expName] ??= [];
      exportsMap[expName].push(impName);
    }
    Object.entries(exportsMap).forEach(([key, value]) => {
      const joinedValues = value.join(", ");
      const cjsLine = `module.exports.${key} = [${joinedValues}];`;
      out.cjs.push(cjsLine);
      const esmLine = `export const ${key} = [${joinedValues}];`;
      out.esm.push(esmLine);
    });
    const subpath = `generated`;
    transformFile({
      doc: out.cjs.join("\n"),
      filename: "index.cjs",
      subpath
    });
    transformFile({
      doc: out.esm.join("\n"),
      filename: "index.mjs",
      subpath
    });
    updateCache({ ...cache, indexSig: newSig });
    toIndexDts(exportsMap, docType);
  }
};

export { toIndexMjs };
