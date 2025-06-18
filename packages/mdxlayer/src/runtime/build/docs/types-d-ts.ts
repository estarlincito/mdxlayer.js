import { t, type TyneType } from 'tyne';

import type { Config } from '@/types.js';
import { readCache, updateCache } from '@/utils/cache.js';
import { toHashNumber } from '@/utils/hash.js';
import { transformFile } from '@/utils/transform.js';

export const toTypesDts = ({
  resolvedFields,
  frontmatterSchema,
  docType,
}: Pick<Config, 'resolvedFields' | 'frontmatterSchema' | 'docType'>) => {
  const defaultSchema: Record<string, TyneType> = {
    _body: t.object({ raw: t.string() }),
    _filePath: t.string(),
    _id: t.string(),
  };

  if (resolvedFields) {
    for (const [key, { types }] of Object.entries(resolvedFields)) {
      defaultSchema[key] = types;
    }
  }

  const doc = t
    .object({ ...frontmatterSchema.shape, ...defaultSchema })
    .toDts(docType);

  const newSig = toHashNumber(doc);
  const cache = readCache();
  const isChanged = cache.typesSig !== newSig;

  if (isChanged) {
    transformFile({
      doc,
      filename: 'types.d.ts',
      subpath: 'generated',
    });

    updateCache({ ...cache, typesSig: newSig });
  }
};
