import path from 'node:path';

import { cache } from '@/cache/index.js';
import { transformFile } from '@/utils/transform.js';

import { toIndexDts } from './index-d.js';

const getExpName = (file: string, docType: string) => {
  const first = path.dirname(file).split(path.sep)[0];
  const main = first === '.' ? 'all' : first;

  return `${main}${docType}`;
};

export const toIndexMjs = (files: string[], docType: string) => {
  const isChanged = cache.changed(JSON.stringify(files), 'index.js');

  if (isChanged) {
    const exportsMap: Record<string, string[]> = {};

    const out: string[] = [];

    for (const filePath of files) {
      const filename = filePath.replace(/\.mdx$/, '');
      const impName = filename.replace(/[-.&/]/g, '_');
      const moduleName = `./${docType}/${filename}.json`;
      const expName = getExpName(filePath, docType);

      const esmLine = `import ${impName} from '${moduleName}' assert { type: 'json' }`;
      out.push(esmLine);

      exportsMap[expName] ??= [];
      exportsMap[expName].push(impName);
    }

    Object.entries(exportsMap).forEach(([key, value]) => {
      const joinedValues = value.join(', ');
      const esmLine = `export const ${key} = [${joinedValues}];`;
      out.push(esmLine);
    });

    // Generating index.js
    transformFile({
      doc: out.join('\n'),
      filename: 'index.js',
      subpath: 'generated',
    });

    // Generating Index.d.ts
    toIndexDts(exportsMap, docType);
  }
};
