'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const path = require('node:path');
const chokidar = require('chokidar');
const index = require('../builder/index.cjs');
const index$1 = require('../config/index.cjs');
const path$1 = require('../config/path.cjs');

const watcher = async () => {
  console.log("Running initial build...");
  await index.builder();
  const { contentDir } = await index$1.getUserConfig();
  const watchers = chokidar.watch(
    [
      path.join(process.cwd(), contentDir),
      path.resolve(process.cwd(), path$1.configPath)
    ],
    { ignoreInitial: true }
  );
  watchers.on("all", async (event, path2) => {
    if (path2.endsWith(path$1.configPath)) {
      console.log("Reloading configuration...");
      setTimeout(async () => {
        await index.builder();
      }, 100);
    } else if (path2.endsWith(".mdx")) {
      console.log("Reprocessing MDX content...");
      setTimeout(async () => {
        await index.builder();
      }, 100);
    }
  });
};

exports.watcher = watcher;
