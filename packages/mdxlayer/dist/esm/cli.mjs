#!/usr/bin/env node
import { run } from './runtime/index.mjs';

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
