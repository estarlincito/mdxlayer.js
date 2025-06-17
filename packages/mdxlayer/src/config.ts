/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable safeguard/no-raw-error */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { build } from 'esbuild';

import { updateCache } from '@/utils/cache.js';
import { checkForChanges } from '@/utils/changes.js';
import { transformFile } from '@/utils/transform.js';

import type { Config } from './types.js';
const cwd = process.cwd();

const CONFIG_FILENAMES = [
  'mdxlayer.config.ts',
  'mdxlayer.config.js',
  'mdxlayer.config.mjs',
  'mdxlayer.config.cjs',
  'mdxlayer.config.mts',
  'mdxlayer.config.cts',
];

export const getUserConfig = async (): Promise<Config> => {
  const isCjs = typeof require !== 'undefined' && typeof module !== 'undefined';
  let configPath: string | null = null;

  for (const filename of CONFIG_FILENAMES) {
    const fullPath = path.resolve(cwd, filename);
    if (fs.existsSync(fullPath)) configPath = fullPath;
  }

  if (configPath) {
    const contents = fs.readFileSync(configPath, 'utf8');
    const format = isCjs ? 'cjs' : 'esm';

    const result = await build({
      bundle: false,
      format,
      platform: 'node',
      stdin: {
        contents,
        loader: 'ts',
        resolveDir: path.dirname(configPath),
        sourcefile: configPath,
      },
      write: false,
    });

    const { isChanged, mtimeMs } = checkForChanges(configPath);

    const newFilename = `compiled-config.${format === 'esm' ? 'mjs' : format}`;
    const newConfigPath = path.resolve(cwd, `.mdxlayer/cache`, newFilename);

    if (isChanged) {
      // adding compiled-config to cache
      transformFile({
        doc: result.outputFiles[0]?.text ?? '',
        filename: newFilename,
        subpath: 'cache',
      });

      updateCache({ [configPath]: mtimeMs });
    }

    if (isCjs) {
      const filePath = fileURLToPath(pathToFileURL(newConfigPath));
      const mod = require(filePath);

      return (mod.default ?? mod) as Config;
    }

    const configModule = await import(pathToFileURL(newConfigPath).href);
    const config: Config = configModule.default;

    return config;
  }

  throw new Error('❌ No mdxlayer config file found.');
};

export const defineConfig = (config: Config) => config;
