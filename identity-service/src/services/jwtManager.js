const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME;

const generateJwt = (userId) => {
  const newJwt = jwt.sign({ userId, sessionId: randomUUID() }, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });

  const { exp: expirationTime } = jwt.decode(newJwt);

  return { newJwt, expirationTime };
};

const validateJwt = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded, userId: decoded.userId };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

module.exports = { generateJwt, validateJwt };
