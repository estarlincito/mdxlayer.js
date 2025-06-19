import path from 'node:path';
import { builder } from 'mdxlayer/builder';
import { watcher } from 'mdxlayer/watcher';

let devProcess = null;
let buildExecuted = false;
const isDev = process.argv.includes("dev");
const isBuild = process.argv.includes("build");
const withMdxlayer = (nextConfig = {}) => {
  if (isDev) {
    setInterval(async () => {
      devProcess ??= await watcher();
    }, 100);
  }
  if (isBuild) {
    if (!buildExecuted) {
      buildExecuted = true;
      setInterval(async () => {
        await builder();
      }, 100);
    }
  }
  return {
    ...nextConfig,
    webpack(config) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "mdxlayer/generated": path.join(process.cwd(), ".mdxlayer/generated")
      };
      return config;
    }
  };
};

export { withMdxlayer };
