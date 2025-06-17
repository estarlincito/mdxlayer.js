import { Config } from '../../../types.js';
interface ToMdxJson extends Pick<Config, 'docType' | 'frontmatterSchema' | 'resolvedFields'> {
    files: string[];
    dir: string;
}
export declare const toMdxJson: ({ docType, resolvedFields, frontmatterSchema, files, dir, }: ToMdxJson) => void;
export {};
