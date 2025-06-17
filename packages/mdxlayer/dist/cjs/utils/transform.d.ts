import { Doc } from '../types.js';
import { Cache } from './cache.js';
export interface TransformFileParams {
    doc: Doc | string | Cache;
    subpath: string;
    filename: string;
}
export declare const transformFile: ({ doc, subpath, filename, }: TransformFileParams) => void;
