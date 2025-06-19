import path from 'node:path';
import { watch } from 'chokidar';
import { builder } from '../builder/index.mjs';
import { getUserConfig } from '../config/index.mjs';
import { configPath } from '../config/path.mjs';

const watcher = async () => {
  console.log("Running initial build...");
  await builder();
  const { contentDir } = await getUserConfig();
  const watchers = watch(
    [
      path.join(process.cwd(), contentDir),
      path.resolve(process.cwd(), configPath)
    ],
    { ignoreInitial: true }
  );
  watchers.on("all", async (event, path2) => {
    if (path2.endsWith(configPath)) {
      console.log("Reloading configuration...");
      setTimeout(async () => {
        await builder();
      }, 100);
    } else if (path2.endsWith(".mdx")) {
      console.log("Reprocessing MDX content...");
      setTimeout(async () => {
        await builder();
      }, 100);
    }
  });
};

export { watcher };
