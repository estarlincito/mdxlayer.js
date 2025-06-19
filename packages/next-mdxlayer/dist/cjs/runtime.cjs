'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const path = require('node:path');
const builder = require('mdxlayer/builder');
const watcher = require('mdxlayer/watcher');

let devProcess = null;
let buildExecuted = false;
const isDev = process.argv.includes("dev");
const isBuild = process.argv.includes("build");
const withMdxlayer = (nextConfig = {}) => {
  if (isDev) {
    setInterval(async () => {
      devProcess ??= await watcher.watcher();
    }, 100);
  }
  if (isBuild) {
    if (!buildExecuted) {
      buildExecuted = true;
      setInterval(async () => {
        await builder.builder();
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

exports.withMdxlayer = withMdxlayer;
