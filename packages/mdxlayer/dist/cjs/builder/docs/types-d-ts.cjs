'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const tyne = require('tyne');
const index = require('../../cache/index.cjs');
const transform = require('../../utils/transform.cjs');

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
    for (const [key, { type }] of Object.entries(resolvedFields)) {
      defaultSchema[key] = type;
    }
  }
  const doc = tyne.t.object({ ...frontmatterSchema.shape, ...defaultSchema }).toDts(docType);
  const isChanged = index.cache.changed(doc, "types.d.ts");
  if (isChanged) {
    transform.transformFile({
      doc,
      filename: "types.d.ts",
      subpath: "generated"
    });
  }
};

exports.toTypesDts = toTypesDts;
