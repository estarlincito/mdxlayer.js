import { t, type TyneType } from 'tyne';

import { cache } from '@/cache/index.js';
import type { Config } from '@/types/index.js';
import { transformFile } from '@/utils/transform.js';

export const toTypesDts = ({
  resolvedFields,
  frontmatterSchema,
  docType,
}: Pick<Config, 'resolvedFields' | 'frontmatterSchema' | 'docType'>) => {
  const defaultSchema: Record<string, TyneType> = {
    _body: t.object({ code: t.string(), raw: t.string() }),
    _filePath: t.string(),
    _id: t.string(),
  };

  if (resolvedFields) {
    for (const [key, { type }] of Object.entries(resolvedFields)) {
      defaultSchema[key] = type;
    }
  }

  const types = t
    .object({ ...frontmatterSchema.shape, ...defaultSchema })
    .toDts();

  const isChanged = cache.changed(types, 'types.d.ts');

  if (isChanged) {
    transformFile({
      doc: `export type ${docType} = ${types}`,
      filename: 'types.d.ts',
      subpath: 'generated',
    });
  }
};
