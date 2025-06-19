'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const path = require('node:path');
const index = require('../../cache/index.cjs');
const transform = require('../../utils/transform.cjs');
const indexDTs = require('./index-d-ts.cjs');

const getExpName = (file, docType) => {
  const first = path.dirname(file).split(path.sep)[0];
  const main = first === "." ? "all" : first;
  return main.charAt(0).toUpperCase() + main.slice(1) + docType;
};
const toIndexMjs = (files, docType) => {
  const isChanged = index.cache.changed(JSON.stringify(files), "index.mjs");
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
    transform.transformFile({
      doc: out.cjs.join("\n"),
      filename: "index.cjs",
      subpath
    });
    transform.transformFile({
      doc: out.esm.join("\n"),
      filename: "index.mjs",
      subpath
    });
    indexDTs.toIndexDts(exportsMap, docType);
  }
};

exports.toIndexMjs = toIndexMjs;
