'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('../builder/index.cjs');
const args = require('../utils/args.cjs');
const index$1 = require('../watcher/index.cjs');

const run = async () => {
  const isBuild = args.getArgs("build");
  const isDev = args.getArgs("dev");
  if (isBuild || isDev) {
    if (isBuild) await index.builder();
    if (isDev) await index$1.watcher();
  }
};

exports.run = run;
