'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const crypto = require('crypto');

const toHashNumber = (content) => {
  const hash = crypto.createHash("md5").update(content).digest();
  return hash.readUInt32BE(0) + hash.readUInt32BE(4);
};

exports.toHashNumber = toHashNumber;
