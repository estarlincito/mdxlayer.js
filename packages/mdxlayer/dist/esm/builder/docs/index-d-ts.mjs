import { cache } from '../../cache/index.mjs';
import { transformFile } from '../../utils/transform.mjs';

const toIndexDts = (exp, docType) => {
  const content = `import type { ${docType} } from './types';

export * from './types';
${Object.keys(exp).map((impName) => `export declare const ${impName}: ${docType}[];`).join("\n")}`;
  const isChanged = cache.changed(content, "index.d.ts");
  if (isChanged) {
    transformFile({
      doc: content,
      filename: "index.d.ts",
      subpath: "generated"
    });
  }
};

export { toIndexDts };
