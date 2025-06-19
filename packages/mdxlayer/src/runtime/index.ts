import { builder } from '@/builder/index.js';
import { getArgs } from '@/utils/args.js';
import { watcher } from '@/watcher/index.js';

export const run = async () => {
  const isBuild = getArgs('build');
  const isDev = getArgs('dev');

  if (isBuild || isDev) {
    if (isBuild) await builder();
    if (isDev) await watcher();
  }
};
