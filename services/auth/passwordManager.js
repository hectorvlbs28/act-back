const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();

const saltOrRounds = 10;
const CRYPTO_KEY = Buffer.from(process.env.CRYPTO_KEY, 'hex'); 

const createPasswordHash = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltOrRounds);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  return isPasswordCorrect;
};

const createPasswordCrypto = async (pswd_value) => {
  const algorithm = "aes-256-ctr";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, CRYPTO_KEY, iv);
  let passwordCrypto = cipher.update(pswd_value, "utf-8", "hex");
  passwordCrypto += cipher.final("hex");
  const ivHex = iv.toString("hex");

  return { ivHex, passwordCrypto };
};

const decryptPasswordCrypto = async (pswd_value, pswd_ivhex) => {
  const algorithm = "aes-256-ctr";
  const iv = Buffer.from(pswd_ivhex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, CRYPTO_KEY, iv);
  let pswdDecrypted = decipher.update(pswd_value, "hex", "utf-8");
  pswdDecrypted += decipher.final("utf-8");

  return pswdDecrypted;
};

module.exports = {
  createPasswordHash,
  comparePassword,
  createPasswordCrypto,
  decryptPasswordCrypto,
};
