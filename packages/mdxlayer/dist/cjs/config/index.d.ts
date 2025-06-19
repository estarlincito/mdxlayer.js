import { Config } from '../types/index.js';
export interface Configs extends Config {
    changed: boolean;
}
export declare const getUserConfig: () => Promise<Configs>;
export declare const defineConfig: (config: Config) => Config;
