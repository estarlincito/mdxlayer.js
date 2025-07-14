/* eslint-disable sort-keys-fix/sort-keys-fix */
import fg from 'fast-glob';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const dir = path.resolve(process.cwd(), 'src');

const files = fg.sync(['**/*.ts'], {
  cwd: dir,
  ignore: ['**/types.ts', '**/*.test.ts', 'types'],
  onlyFiles: true,
  absolute: true,
});

const entry = files.reduce((acc, filePath) => {
  const relPath = path.relative(dir, filePath);
  const name = relPath.replace(/\.[tj]s$/, '');

  return { ...acc, [name]: filePath };
}, {});

const dtsPlugin = dts({
  entryRoot: 'src',
  insertTypesEntry: true,
  outDir: 'dist',
  tsconfigPath: './tsconfig.json',
  exclude: ['vite.config.ts'],
});

export const viteConfig = defineConfig({
  build: {
    ssr: true,
    lib: {
      entry,
    },
    minify: false,
    target: 'esnext',

    rollupOptions: {
      external: ['*'],
      output: [
        {
          format: 'esm',
          dir: 'dist',
          preserveModules: true,
        },
      ],
    },
  },
  plugins: [dtsPlugin],
  resolve: {
    alias: {
      '@': dir,
    },
  },
});
