import { builder } from '../builder/index.mjs';
import { getArgs } from '../utils/args.mjs';
import { watcher } from '../watcher/index.mjs';

const run = async () => {
  const isBuild = getArgs("build");
  const isDev = getArgs("dev");
  if (isBuild || isDev) {
    if (isBuild) await builder();
    if (isDev) await watcher();
  }
};

export { run };
