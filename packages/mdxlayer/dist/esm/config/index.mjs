import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { cache } from '../cache/index.mjs';
import { format } from '../utils/format.mjs';
import { transformFile } from '../utils/transform.mjs';
import { configPath } from './path.mjs';

const getUserConfig = async () => {
  const newFilename = `compiled-config.${format === "esm" ? "mjs" : format}`;
  const contents = fs.readFileSync(configPath, "utf8");
  const compiledConfig = async () => {
    const result = await build({
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
    transformFile({
      doc: result.outputFiles[0]?.text ?? "",
      filename: newFilename,
      subpath: "cache"
    });
  };
  const isChanged = cache.changed(contents, newFilename);
  if (isChanged) await compiledConfig();
  const newConfigPath = path.resolve(
    process.cwd(),
    `.mdxlayer/cache`,
    newFilename
  );
  if (format === "cjs") {
    const filePath = fileURLToPath(pathToFileURL(newConfigPath));
    delete require.cache[require.resolve(filePath)];
    const mod = require(filePath);
    return { ...mod.default ?? mod, changed: isChanged };
  }
  const configModule = await import(`${pathToFileURL(newConfigPath).href}?t=${Date.now()}`);
  return { ...configModule.default, changed: isChanged };
};
const defineConfig = (config) => config;

export { defineConfig, getUserConfig };
