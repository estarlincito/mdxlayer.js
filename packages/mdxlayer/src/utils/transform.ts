/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

import type { Doc } from '@/types.js';

import type { Cache } from './cache.js';

export interface TransformFileParams {
  doc: Doc | string | Cache;
  subpath: string;
  filename: string;
}

export const transformFile = ({
  doc,
  subpath,
  filename,
}: TransformFileParams) => {
  const outputPath = path.resolve(
    process.cwd(),
    `.mdxlayer/${subpath}`,
    filename,
  );

  const content = typeof doc === 'string' ? doc : JSON.stringify(doc, null, 2);

  try {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content);
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
};
