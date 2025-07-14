/* eslint-disable no-console */
import { compile } from '@mdx-js/mdx';
import type { PluggableList } from 'unified';

import type { Config } from '@/types/index.js';

export const processMDX = async (
  options: Config['options'] = {},
  raw: string,
): Promise<string> => {
  try {
    const compiled = await compile(raw, {
      format: 'mdx',
      ...options,
      outputFormat: 'function-body',
      rehypePlugins: (options.rehypePlugins as PluggableList) ?? [],
      remarkPlugins: (options.remarkPlugins as PluggableList) ?? [],
    });

    return String(compiled.value);
  } catch (err) {
    console.error('Error processing MDX:', err);
    return '';
  }
};
