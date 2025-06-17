import fs from 'node:fs';
import path from 'node:path';
import { transformFile } from '../../../utils/transform.mjs';

const toIndexDts = (exp, docType) => {
  const content = `import type { ${docType} } from './types';

export * from './types';
${Object.keys(exp).map((impName) => `export declare const ${impName}: ${docType}[];`).join("\n")}`;
  const indexPath = path.resolve(process.cwd(), ".mdxlayer", "index.d.ts");
  const isChanged = !fs.existsSync(indexPath);
  if (isChanged) {
    transformFile({
      doc: content,
      filename: "index.d.ts",
      subpath: "generated"
    });
  }
};

export { toIndexDts };
