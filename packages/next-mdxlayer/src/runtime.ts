/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-param-reassign */

/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'node:path';

// @ts-ignore
import { builder } from 'mdxlayer/builder';
// @ts-ignore
import { watcher } from 'mdxlayer/watcher';

let devProcess = null;
let buildExecuted = false;
const isDev = process.argv.includes('dev');
const isBuild = process.argv.includes('build');

/**
 * Next.js plugin to integrate the MDXLayer build system.
 *
 * This plugin automatically runs `mdxlayer dev` or `mdxlayer build`
 * based on the current process arguments. It also injects the `mdxlayer/generated`
 * alias into the Webpack configuration to enable project-wide access
 * to the generated files.
 *
 * @param {import('next').NextConfig} [nextConfig={}] - Optional Next.js configuration object.
 * @returns {import('next').NextConfig} - The enhanced Next.js configuration with MDXLayer support.
 */
export const withMdxlayer = (nextConfig = {}) => {
  if (isDev) {
    devProcess ??= watcher();
  }

  if (isBuild) {
    if (!buildExecuted) {
      buildExecuted = true;
      builder();
    }
  }

  return {
    ...nextConfig,
    webpack(config: any) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'mdxlayer/generated': path.join(process.cwd(), '.mdxlayer/generated'),
      };

      return config;
    },
  };
};
