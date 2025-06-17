// runtime/index.ts
import { getUserConfig } from '@/config.js';
import { getArgs } from '@/utils/args.js';

import { build } from './build/index.js';
import { dev } from './dev.js';

export const run = async () => {
  const isBuild = getArgs('build');
  const isDev = getArgs('dev');

  if (isBuild || isDev) {
    const config = await getUserConfig();
    if (isBuild) await build(config);
    if (isDev) await dev(config);
  }
};

// mdxlayer build
// mdxlayer dev
