'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const tyne = require('tyne');
const cache = require('../../../utils/cache.cjs');
const hash = require('../../../utils/hash.cjs');
const transform = require('../../../utils/transform.cjs');

const toTypesDts = ({
  resolvedFields,
  frontmatterSchema,
  docType
}) => {
  const defaultSchema = {
    _body: tyne.t.object({ raw: tyne.t.string() }),
    _filePath: tyne.t.string(),
    _id: tyne.t.string()
  };
  if (resolvedFields) {
    for (const [key, { types }] of Object.entries(resolvedFields)) {
      defaultSchema[key] = types;
    }
  }
  const doc = tyne.t.object({ ...frontmatterSchema.shape, ...defaultSchema }).toDts(docType);
  const newSig = hash.toHashNumber(doc);
  const cache$1 = cache.readCache();
  const isChanged = cache$1.typesSig !== newSig;
  if (isChanged) {
    transform.transformFile({
      doc,
      filename: "types.d.ts",
      subpath: "generated"
    });
    cache.updateCache({ ...cache$1, typesSig: newSig });
  }
};

exports.toTypesDts = toTypesDts;
