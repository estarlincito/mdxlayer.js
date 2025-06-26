/* eslint-disable no-console */
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { type Plugin, unified } from 'unified';

import type { Config } from '@/types/index.js';

export const processMarkdown = async (
  options: Config['options'] = {},
  raw: string,
): Promise<string> => {
  try {
    const processor = unified()
      // Parse Markdown to AST
      .use(remarkParse)
      // Apply user remark plugins
      .use((options.remarkPlugins as Plugin[]) ?? [])
      // GitHub Flavored Markdown support
      .use(remarkGfm)
      // Convert Markdown AST to HTML AST
      .use(remarkRehype)
      // Apply user rehype plugins
      .use((options.rehypePlugins as Plugin[]) ?? [])
      // Serialize HTML AST to string
      .use(rehypeStringify);

    const file = await processor.process(raw);

    return String(file);
  } catch (err) {
    console.error('Error processing Markdown:', err);
    return '';
  }
};
