/* eslint-disable no-console */
/* eslint-disable no-shadow */
import path from 'node:path';

import { watch } from 'chokidar';

import { builder } from '@/builder/index.js';
import { getUserConfig } from '@/config/index.js';
import { configPath } from '@/config/path.js';

export const watcher = async () => {
  console.log('Running initial build...');
  await builder();
  const { contentDir } = await getUserConfig();
  const watchers = watch(
    [
      path.join(process.cwd(), contentDir),
      path.resolve(process.cwd(), configPath),
    ],
    { ignoreInitial: true },
  );

  watchers.on('all', async (event, path) => {
    if (path.endsWith(configPath)) {
      console.log('Reloading configuration...');
      setTimeout(async () => {
        await builder();
      }, 100);
    } else if (path.endsWith('.mdx')) {
      console.log('Reprocessing MDX content...');
      setTimeout(async () => {
        await builder();
      }, 100);
    }
  });
};
