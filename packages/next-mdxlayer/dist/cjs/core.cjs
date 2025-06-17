'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const path = require('node:path');
const runtime = require('./runtime.cjs');

let devProcess = null;
let buildExecuted = false;
const isDev = process.argv.includes("dev");
const isBuild = process.argv.includes("build");
const withMdxlayer = (nextConfig = {}) => {
  if (isDev) {
    devProcess ??= runtime.runMdxlayer("dev");
  }
  if (isBuild) {
    if (!buildExecuted) {
      buildExecuted = true;
      runtime.runMdxlayer("build");
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
