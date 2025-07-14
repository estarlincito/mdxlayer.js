/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ChildProcess, spawn } from 'node:child_process';
import path from 'node:path';

let buildExecuted = false;
const isDev = process.argv.includes('dev');
const isStart = process.argv.includes('start');
const isBuild = process.env.NODE_ENV === 'production';

declare global {
  var __mdxlayerDevProcess: ChildProcess | undefined;
}

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
  // build mode
  if (isBuild && !isStart && !buildExecuted) {
    buildExecuted = true;

    void (async () => {
      try {
        const { builder } = await import('mdxlayer/builder');
        await builder();
      } catch (error) {
        console.error('❌ MDX production build failed:', error);
        process.exit(1);
      }
    })();
  }
  // dev mode
  if (isDev) {
    if (!global.__mdxlayerDevProcess) {
      global.__mdxlayerDevProcess = spawn(
        'node',
        ['-e', "import('mdxlayer/watcher').then(m => m.watcher())"],
        {
          detached: true,
          stdio: 'inherit',
        },
      );

      ['exit', 'SIGINT', 'SIGTERM'].forEach((event) => {
        process.on(event, () => {
          global.__mdxlayerDevProcess?.kill();
          global.__mdxlayerDevProcess = undefined;
        });
      });
    }
  }

  return {
    ...nextConfig,
    turbopack: {
      resolveAlias: {
        'mdxlayer/generated': path.join(process.cwd(), '.mdxlayer/generated'),
      },
    },

    webpack(config: any) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'mdxlayer/generated': path.join(process.cwd(), '.mdxlayer/generated'),
      };

      return config;
    },
  };
};
