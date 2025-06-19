import crypto from 'crypto';

const string = (content: string): string =>
  crypto.createHash('md5').update(content).digest('hex');

const number = (content: string): number => {
  const hash = crypto.createHash('md5').update(content).digest();

  return hash.readUInt32BE(0) + hash.readUInt32BE(4);
};

export const hash = { number, string };
