import { cache } from '@/cache/index.js';
import { transformFile } from '@/utils/transform.js';

export const toIndexDts = (exp: Record<string, string[]>, docType: string) => {
  const content = `import type { ${docType} } from './types';\n\nexport * from './types';
${Object.keys(exp)
  .map((impName) => `export declare const ${impName}: ${docType}[];`)
  .join('\n')}`;

  const isChanged = cache.changed(content, 'index.d.ts');

  if (isChanged) {
    transformFile({
      doc: content,
      filename: 'index.d.ts',
      subpath: 'generated',
    });
  }
};
