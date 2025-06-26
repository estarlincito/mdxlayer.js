/* eslint-disable no-param-reassign */

/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'node:path';

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
    setTimeout(async () => {
      devProcess ??= await import('mdxlayer/watcher').then((m) => m.watcher());
    }, 100);
  }

  if (isBuild) {
    if (!buildExecuted) {
      buildExecuted = true;

      setTimeout(async () => {
        await import('mdxlayer/builder').then((m) => m.builder());
      }, 100);
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
