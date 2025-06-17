import fs from 'node:fs';
import path from 'node:path';

// import { toHash } from '@/utils/hash.js';
import { transformFile } from '@/utils/transform.js';

export const toTypesDts = (types: string) => {
  const typesPath = path.resolve(process.cwd(), '.mdxlayer', 'types.d.ts');

  const isChanged = !fs.existsSync(typesPath);
  // ||
  // toHash(content) !== toHash(fs.readFileSync(typesPath, 'utf-8'));

  if (isChanged) {
    // types.d.ts
    transformFile({
      doc: types,
      filename: 'types.d.ts',
      subpath: 'generated',
    });
  }
};
