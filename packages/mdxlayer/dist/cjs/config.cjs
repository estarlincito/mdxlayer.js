'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const fs = require('node:fs');
const path = require('node:path');
const node_url = require('node:url');
const esbuild = require('esbuild');
const cache = require('./utils/cache.cjs');
const changes = require('./utils/changes.cjs');
const transform = require('./utils/transform.cjs');

const cwd = process.cwd();
const CONFIG_FILENAMES = [
  "mdxlayer.config.ts",
  "mdxlayer.config.js",
  "mdxlayer.config.mjs",
  "mdxlayer.config.cjs",
  "mdxlayer.config.mts",
  "mdxlayer.config.cts"
];
const getUserConfig = async () => {
  const isCjs = typeof require !== "undefined" && typeof module !== "undefined";
  let configPath = null;
  for (const filename of CONFIG_FILENAMES) {
    const fullPath = path.resolve(cwd, filename);
    if (fs.existsSync(fullPath)) configPath = fullPath;
  }
  if (configPath) {
    const contents = fs.readFileSync(configPath, "utf8");
    const format = isCjs ? "cjs" : "esm";
    const result = await esbuild.build({
      bundle: false,
      format,
      platform: "node",
      stdin: {
        contents,
        loader: "ts",
        resolveDir: path.dirname(configPath),
        sourcefile: configPath
      },
      write: false
    });
    const { isChanged, mtimeMs } = changes.checkForChanges(configPath);
    const newFilename = `compiled-config.${format === "esm" ? "mjs" : format}`;
    const newConfigPath = path.resolve(cwd, `.mdxlayer/cache`, newFilename);
    if (isChanged) {
      transform.transformFile({
        doc: result.outputFiles[0]?.text ?? "",
        filename: newFilename,
        subpath: "cache"
      });
      cache.updateCache({ [configPath]: mtimeMs });
    }
    if (isCjs) {
      const filePath = node_url.fileURLToPath(node_url.pathToFileURL(newConfigPath));
      const mod = require(filePath);
      return mod.default ?? mod;
    }
    const configModule = await import(node_url.pathToFileURL(newConfigPath).href);
    const config = configModule.default;
    return config;
  }
  throw new Error("❌ No mdxlayer config file found.");
};
const defineConfig = (config) => config;

exports.defineConfig = defineConfig;
exports.getUserConfig = getUserConfig;
