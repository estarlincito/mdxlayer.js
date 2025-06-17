'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const config = require('../config.cjs');
const args = require('../utils/args.cjs');
const index = require('./build/index.cjs');
const dev = require('./dev.cjs');

const run = async () => {
  const isBuild = args.getArgs("build");
  const isDev = args.getArgs("dev");
  if (isBuild || isDev) {
    const config$1 = await config.getUserConfig();
    if (isBuild) await index.build(config$1);
    if (isDev) await dev.dev(config$1);
  }
};

exports.run = run;
