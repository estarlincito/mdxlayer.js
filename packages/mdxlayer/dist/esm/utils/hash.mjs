import crypto from 'crypto';

const string = (content) => crypto.createHash("md5").update(content).digest("hex");
const number = (content) => {
  const hash2 = crypto.createHash("md5").update(content).digest();
  return hash2.readUInt32BE(0) + hash2.readUInt32BE(4);
};
const hash = { number, string };

export { hash };
