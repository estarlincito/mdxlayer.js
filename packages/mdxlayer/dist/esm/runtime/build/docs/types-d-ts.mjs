import { t } from 'tyne';
import { readCache, updateCache } from '../../../utils/cache.mjs';
import { toHashNumber } from '../../../utils/hash.mjs';
import { transformFile } from '../../../utils/transform.mjs';

const toTypesDts = ({
  resolvedFields,
  frontmatterSchema,
  docType
}) => {
  const defaultSchema = {
    _body: t.object({ raw: t.string() }),
    _filePath: t.string(),
    _id: t.string()
  };
  if (resolvedFields) {
    for (const [key, { types }] of Object.entries(resolvedFields)) {
      defaultSchema[key] = types;
    }
  }
  const doc = t.object({ ...frontmatterSchema.shape, ...defaultSchema }).toDts(docType);
  const newSig = toHashNumber(doc);
  const cache = readCache();
  const isChanged = cache.typesSig !== newSig;
  if (isChanged) {
    transformFile({
      doc,
      filename: "types.d.ts",
      subpath: "generated"
    });
    updateCache({ ...cache, typesSig: newSig });
  }
};

export { toTypesDts };
