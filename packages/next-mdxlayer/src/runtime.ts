/* eslint-disable safeguard/no-raw-error */
/* eslint-disable no-console */
import { spawn, spawnSync } from 'child_process';

export const runMdxlayer = (mode: 'dev' | 'build') => {
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

  if (mode === 'dev') {
    const proc = spawn(command, ['mdxlayer', 'dev'], {
      shell: false,
      stdio: 'inherit',
    });

    proc.on('error', (err) => {
      console.error(`[mdxlayer dev] error:`, err);
    });

    console.log('> mdxlayer dev started');
    return proc;
  }

  if (mode === 'build') {
    const result = spawnSync(command, ['mdxlayer', 'build'], {
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      throw new Error('❌ mdxlayer build failed');
    }

    console.log('> mdxlayer build completed');
  }
  return null;
};
