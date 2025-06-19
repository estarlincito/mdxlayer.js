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
export declare const withMdxlayer: (nextConfig?: {}) => {
    webpack(config: any): any;
};
