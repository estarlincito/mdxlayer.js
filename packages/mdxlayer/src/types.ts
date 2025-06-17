/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TyneType } from 'tyne';
import type * as unified from 'unified';

export interface Options {
  remarkPlugins?: unified.Pluggable[];
  rehypePlugins?: unified.Pluggable[];
}

export interface Doc {
  _filePath?: string;
  _id?: string;
  _body?: { raw: string };
  [key: string]: any;
}

export type FieldResolver = Record<
  string,
  {
    resolve: (doc: Doc) => any | Promise<any>;
  }
>;

export interface Config {
  docType: string;
  options?: Options;
  contentDir: string;
  frontmatterSchema: TyneType;
  resolvedFields?: FieldResolver;
  // outDir?: string;
  // languages?: string[];
}
