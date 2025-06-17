import fs from 'node:fs';
import path from 'node:path';

// import { toHash } from '@/utils/hash.js';
import { transformFile } from '@/utils/transform.js';

export const toIndexDts = (exp: Record<string, string[]>, docType: string) => {
  const content = `import type { ${docType} } from './types';\n\nexport * from './types';
${Object.keys(exp)
  .map((impName) => `export declare const ${impName}: ${docType}[];`)
  .join('\n')}`;

  const indexPath = path.resolve(process.cwd(), '.mdxlayer', 'index.d.ts');

  const isChanged = !fs.existsSync(indexPath);
  // ||
  // toHash(content) !== toHash(fs.readFileSync(indexPath, 'utf-8'));

  if (isChanged) {
    // index.d.ts
    transformFile({
      doc: content,
      filename: 'index.d.ts',
      subpath: 'generated',
    });
  }
};
