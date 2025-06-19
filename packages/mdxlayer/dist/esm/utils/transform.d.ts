import { Cache } from '../cache/index.js';
import { Doc } from '../types/index.js';
export interface TransformFileParams {
    doc: Doc | string | Cache;
    subpath: string;
    filename: string;
}
export declare const transformFile: ({ doc, subpath, filename, }: TransformFileParams) => void;
