const crypto = require('crypto');

const CRYPTO_KEY = Buffer.from(process.env.CRYPTO_KEY, 'hex');
const ALGORITHM = 'aes-256-ctr';

const encrypt = (value) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, CRYPTO_KEY, iv);
  let encrypted = cipher.update(value, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, ivHex: iv.toString('hex') };
};

const decrypt = (encrypted, ivHex) => {
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, CRYPTO_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};

module.exports = { encrypt, decrypt };
