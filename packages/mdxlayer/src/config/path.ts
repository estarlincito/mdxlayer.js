/* eslint-disable safeguard/no-raw-error */
import fs from 'node:fs';
import path from 'node:path';

import { cliConfigFile } from '@/utils/args.js';
const CONFIG_FILENAMES = [
  'mdxlayer.config.ts',
  'mdxlayer.config.js',
  'mdxlayer.config.mjs',
  'mdxlayer.config.cjs',
  'mdxlayer.config.mts',
  'mdxlayer.config.cts',
];

export const configPath = (() => {
  // ============ Loading user config from args ==================
  if (cliConfigFile) {
    if (fs.existsSync(cliConfigFile)) return cliConfigFile;
  }

  // ============ Loading default user config ==================
  for (const filename of CONFIG_FILENAMES) {
    const fullPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(fullPath)) return fullPath;
  }

  throw new Error('❌ No mdxlayer config file found.');
})();
