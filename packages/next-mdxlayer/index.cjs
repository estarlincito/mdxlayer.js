/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
setTimeout(async () => {
  await import('mdxlayer').then((m) => m.builder());
}, 100);
//node --watch index.cjs

console.log(typeof require !== 'undefined' && typeof module !== 'undefined');
