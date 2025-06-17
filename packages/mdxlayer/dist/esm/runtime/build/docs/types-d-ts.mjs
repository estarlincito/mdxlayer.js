import fs from 'node:fs';
import path from 'node:path';
import { transformFile } from '../../../utils/transform.mjs';

const toTypesDts = (types) => {
  const typesPath = path.resolve(process.cwd(), ".mdxlayer", "types.d.ts");
  const isChanged = !fs.existsSync(typesPath);
  if (isChanged) {
    transformFile({
      doc: types,
      filename: "types.d.ts",
      subpath: "generated"
    });
  }
};

export { toTypesDts };
