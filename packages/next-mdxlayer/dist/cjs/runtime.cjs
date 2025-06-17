'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const child_process = require('child_process');

const runMdxlayer = (mode) => {
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  if (mode === "dev") {
    const proc = child_process.spawn(command, ["mdxlayer", "dev"], {
      shell: false,
      stdio: "inherit"
    });
    proc.on("error", (err) => {
      console.error(`[mdxlayer dev] error:`, err);
    });
    console.log("> mdxlayer dev started");
    return proc;
  }
  if (mode === "build") {
    const result = child_process.spawnSync(command, ["mdxlayer", "build"], {
      stdio: "inherit"
    });
    if (result.status !== 0) {
      throw new Error("❌ mdxlayer build failed");
    }
    console.log("> mdxlayer build completed");
  }
  return null;
};

exports.runMdxlayer = runMdxlayer;
