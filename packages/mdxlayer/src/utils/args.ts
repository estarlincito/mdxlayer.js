const cliArgs = process.argv.slice(2);

export const hasCliFlag = (flags: string | string[]) => {
  if (typeof flags === 'string') {
    return cliArgs.includes(flags);
  }
  return flags.some((flag) => cliArgs.includes(flag));
};

export const cliConfigFile = (() => {
  if (hasCliFlag('--config')) {
    const maybeConfig = cliArgs[cliArgs.indexOf('--config') + 1];

    return maybeConfig ?? null;
  }
  return null;
})();

export const cliOutDir = (() => {
  const defaultOutDir = '.mdxlayer';
  if (hasCliFlag('--out')) {
    const maybeOut = cliArgs[cliArgs.indexOf('--out') + 1];

    return maybeOut ?? defaultOutDir;
  }
  return defaultOutDir;
})();
