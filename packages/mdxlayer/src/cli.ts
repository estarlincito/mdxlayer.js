#!/usr/bin/env node
/* eslint-disable no-console */
import { run } from './runtime/index.js';

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
