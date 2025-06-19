'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const fs = require('node:fs');
const path$1 = require('node:path');
const node_url = require('node:url');
const esbuild = require('esbuild');
const index = require('../cache/index.cjs');
const format = require('../utils/format.cjs');
const transform = require('../utils/transform.cjs');
const path = require('./path.cjs');

const getUserConfig = async () => {
  const newFilename = `compiled-config.${format.format === "esm" ? "mjs" : format.format}`;
  const contents = fs.readFileSync(path.configPath, "utf8");
  const compiledConfig = async () => {
    const result = await esbuild.build({
      bundle: false,
      format: format.format,
      platform: "node",
      stdin: {
        contents,
        loader: "ts",
        resolveDir: path$1.dirname(path.configPath),
        sourcefile: path.configPath
      },
      write: false
    });
    transform.transformFile({
      doc: result.outputFiles[0]?.text ?? "",
      filename: newFilename,
      subpath: "cache"
    });
  };
  const isChanged = index.cache.changed(contents, newFilename);
  if (isChanged) await compiledConfig();
  const newConfigPath = path$1.resolve(
    process.cwd(),
    `.mdxlayer/cache`,
    newFilename
  );
  if (format.format === "cjs") {
    const filePath = node_url.fileURLToPath(node_url.pathToFileURL(newConfigPath));
    delete require.cache[require.resolve(filePath)];
    const mod = require(filePath);
    return { ...mod.default ?? mod, changed: isChanged };
  }
  const configModule = await import(`${node_url.pathToFileURL(newConfigPath).href}?t=${Date.now()}`);
  return { ...configModule.default, changed: isChanged };
};
const defineConfig = (config) => config;

exports.defineConfig = defineConfig;
exports.getUserConfig = getUserConfig;
