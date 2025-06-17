export type Cache = Record<string, number>;
export declare const readCache: () => Cache;
export declare const updateCache: (item: Cache) => void;
