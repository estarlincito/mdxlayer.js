import fs from 'node:fs';
import fg from 'fast-glob';
import { toHashNumber } from './packages/mdxlayer/src/utils/hash.ts';

const toDocs = async (file: string) => {
  const folders = await fg('packages/*', { onlyDirectories: true });
  const rootContent = fs.readFileSync(`./${file}`, 'utf-8');

  folders.forEach((folder) => {
    if (folder === 'packages/dev') return;
    const filePath = folder + `/${file}`;

    let pkgContent = (() => {
      try {
        return fs.readFileSync(filePath, 'utf-8');
      } catch {
        return '';
      }
    })();

    if (toHashNumber(rootContent) !== toHashNumber(pkgContent)) {
      fs.writeFileSync(filePath, rootContent);
    }
  });
};

await toDocs('README.md');
await toDocs('LICENSE');
