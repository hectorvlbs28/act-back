const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const createPasswordHash = (password) => bcrypt.hash(password, SALT_ROUNDS);

const comparePassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

module.exports = { createPasswordHash, comparePassword };
