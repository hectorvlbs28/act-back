const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME;

const generateJwt = (userId) => {
  const newJwt = jwt.sign({ userId, sessionId: uuidv4() }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION_TIME,
  });
  const decodedJwt = jwt.decode(newJwt);
  const expirationTime = decodedJwt.exp;

  return {
    newJwt,
    expirationTime,
  };
};

const validateJwt = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      decoded,
      userId: decoded.userId,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

module.exports = { generateJwt, validateJwt };
