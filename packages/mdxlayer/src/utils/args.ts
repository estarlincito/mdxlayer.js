export const getArgs = (arg: string | string[]) => {
  const args = process.argv.slice(2);

  if (typeof arg === 'string') {
    return args.includes(arg);
  }

  return arg.some((a) => args.includes(a));
};
