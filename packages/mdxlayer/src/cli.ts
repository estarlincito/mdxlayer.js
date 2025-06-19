#!/usr/bin/env node
import { run } from '@/runtime/index.js';

/* eslint-disable no-console */

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

// mdxlayer build
// mdxlayer dev
