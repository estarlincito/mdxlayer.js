import crypto from 'crypto';

// export const toHash = (content: string): string =>
//   crypto.createHash('md5').update(content).digest('hex');

export const toHashNumber = (content: string): number => {
  const hash = crypto.createHash('md5').update(content).digest();

  return hash.readUInt32BE(0) + hash.readUInt32BE(4);
};
