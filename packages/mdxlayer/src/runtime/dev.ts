/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';

import type { Config } from '@/types.js';

import { build } from './build/index.js';

export const dev = async (config: Config) => {
  await build(config);

  const watchDir = path.resolve(process.cwd(), config.contentDir);

  fs.watch(watchDir, { recursive: true }, async (eventType, filename) => {
    if (filename?.endsWith('.mdx')) {
      console.log(`[${eventType}] ${filename}`);
      await build(config);
    }
  });

  console.log(`Watching MDX files in ${watchDir}`);
};
