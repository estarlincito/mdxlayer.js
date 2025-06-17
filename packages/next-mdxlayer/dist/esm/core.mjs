import path from 'node:path';
import { runMdxlayer } from './runtime.mjs';

let devProcess = null;
let buildExecuted = false;
const isDev = process.argv.includes("dev");
const isBuild = process.argv.includes("build");
const withMdxlayer = (nextConfig = {}) => {
  if (isDev) {
    devProcess ??= runMdxlayer("dev");
  }
  if (isBuild) {
    if (!buildExecuted) {
      buildExecuted = true;
      runMdxlayer("build");
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
