import { builder } from '@/builder/index.js';
import { hasCliFlag } from '@/utils/args.js';
import { watcher } from '@/watcher/index.js';

export const run = async () => {
  const isBuild = hasCliFlag('build');
  const isDev = hasCliFlag('dev');

  if (isBuild || isDev) {
    if (isBuild) await builder();
    if (isDev) await watcher();
  }
};
