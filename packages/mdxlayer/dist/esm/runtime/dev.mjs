import fs from 'node:fs';
import path from 'node:path';
import { build } from './build/index.mjs';

const dev = async (config) => {
  await build(config);
  const watchDir = path.resolve(process.cwd(), config.contentDir);
  fs.watch(watchDir, { recursive: true }, async (eventType, filename) => {
    if (filename?.endsWith(".mdx")) {
      console.log(`[${eventType}] ${filename}`);
      await build(config);
    }
  });
  console.log(`Watching MDX files in ${watchDir}`);
};

export { dev };
