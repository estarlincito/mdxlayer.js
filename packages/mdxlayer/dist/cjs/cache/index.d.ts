export type Cache = Record<string, number>;
export declare const cache: {
    changed: (content: string, key: string) => boolean;
    get: () => Cache;
    mtime: (key: string) => boolean;
    set: (item: Cache) => void;
};
