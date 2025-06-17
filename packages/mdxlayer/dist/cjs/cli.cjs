#!/usr/bin/env node
'use strict';

const index = require('./runtime/index.cjs');

index.run().catch((err) => {
  console.error(err);
  process.exit(1);
});
