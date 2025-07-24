/* eslint-disable no-shadow */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { build, type Plugin } from 'esbuild';

import { cache } from '@/cache/index.js';
import type { Config } from '@/types/index.js';
import { cliOutDir } from '@/utils/args.js';

import { configPath } from './path.js';

const externalizePackagesPlugin = (configPath: string): Plugin => ({
  name: 'externalize-packages',

  setup: (build) => {
    const filter = /^[^./]/;

    build.onResolve({ filter }, (args) => {
      if (args.path.includes(configPath)) {
        return { external: false, path: args.path };
      }

      return { external: true, path: args.path };
    });
  },
});

export interface Configs extends Config {
  changed: boolean;
}

export const getUserConfig = async (): Promise<Configs> => {
  const newFilename = 'compiled-config.js';

  const outfile = path.resolve(
    process.cwd(),
    `${cliOutDir}/cache`,
    newFilename,
  );

  const compiledConfig = async () => {
    const packagePath = path.resolve(process.cwd(), 'package.json');

    await build({
      // absWorkingDir: cwd,
      bundle: true,
      entryPoints: [configPath],
      format: 'esm',
      logLevel: 'silent',
      metafile: true,
      outfile,
      platform: 'node',
      plugins: [externalizePackagesPlugin(packagePath)],
      sourcemap: true,
    });
  };

  let isChanged = false;
  const exists = fs.existsSync(outfile);

  if (exists) {
    const content = fs.readFileSync(outfile, 'utf8');
    isChanged = cache.changed(content, newFilename);
  }

  if (isChanged || !exists) await compiledConfig();

  const configModule = await import(
    `${pathToFileURL(outfile).href}?t=${Date.now()}`
  );

  return { ...configModule.default, changed: isChanged };
};

export const defineConfig = (config: Config): Config => config;
