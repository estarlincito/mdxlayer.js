import { t } from 'tyne';
import { cache } from '../../cache/index.mjs';
import { transformFile } from '../../utils/transform.mjs';

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
    for (const [key, { type }] of Object.entries(resolvedFields)) {
      defaultSchema[key] = type;
    }
  }
  const doc = t.object({ ...frontmatterSchema.shape, ...defaultSchema }).toDts(docType);
  const isChanged = cache.changed(doc, "types.d.ts");
  if (isChanged) {
    transformFile({
      doc,
      filename: "types.d.ts",
      subpath: "generated"
    });
  }
};

export { toTypesDts };
