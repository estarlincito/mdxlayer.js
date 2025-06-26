export const loadModule = async (pluginPath: string) => {
  const mod = await import(pluginPath);

  return mod.default ?? mod;
};
