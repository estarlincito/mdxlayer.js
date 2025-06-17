import { getUserConfig } from '../config.mjs';
import { getArgs } from '../utils/args.mjs';
import { build } from './build/index.mjs';
import { dev } from './dev.mjs';

const run = async () => {
  const isBuild = getArgs("build");
  const isDev = getArgs("dev");
  if (isBuild || isDev) {
    const config = await getUserConfig();
    if (isBuild) await build(config);
    if (isDev) await dev(config);
  }
};

export { run };
