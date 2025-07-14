import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { build } from 'esbuild';

import { cache } from '@/cache/index.js';
import type { Config } from '@/types/index.js';
import { cliOutDir } from '@/utils/args.js';
import { transformFile } from '@/utils/transform.js';

import { configPath } from './path.js';

export interface Configs extends Config {
  changed: boolean;
}

export const getUserConfig = async (): Promise<Configs> => {
  const newFilename = 'compiled-config.js';
  const contents = fs.readFileSync(configPath, 'utf8');

  const compiledConfig = async () => {
    const result = await build({
      bundle: false,
      format: 'esm',
      platform: 'node',
      stdin: {
        contents,
        loader: 'ts',
        resolveDir: path.dirname(configPath),
        sourcefile: configPath,
      },
      write: false,
    });

    // adding compiled-config to cache
    transformFile({
      doc: result.outputFiles[0]?.text ?? '',
      filename: newFilename,
      subpath: 'cache',
    });
  };

  const isChanged = cache.changed(contents, newFilename);
  if (isChanged) await compiledConfig();

  const newConfigPath = path.resolve(
    process.cwd(),
    `${cliOutDir}/cache`,
    newFilename,
  );

  const configModule = await import(
    `${pathToFileURL(newConfigPath).href}?t=${Date.now()}`
  );

  return { ...configModule.default, changed: isChanged };
};

export const defineConfig = (config: Config): Config => config;
