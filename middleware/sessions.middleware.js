const HttpStatus = require("../utils/httpStatus");
const { handleError } = require("../utils/handleError");
const { validateJwt } = require("../services/auth/jwtManager.js");
const {
  getSessionsCountService,
  sessionExistsService,
} = require("../services/database/sessions");
const {
  internalErrorMessage,
  sessionsLimitMessage,
  sessionNotFoundMessage,
  missingTokenErrorMessage,
  tokenExpiredErrorMessage,
} = require("../utils/errorMessages");
require("dotenv").config();

const LIMIT_SESSIONS = process.env.LIMIT_SESSIONS;

const checkActiveSessionsLimit = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const sessionsCount = await getSessionsCountService(userName);

    if (sessionsCount >= LIMIT_SESSIONS) {
      return handleError(res, HttpStatus.UNAUTHORIZED, sessionsLimitMessage);
    }

    next();
  } catch (error) {
    console.log(
      `-- Error in checkActiveSessionsLimit -> error: `,
      error.message
    );
    return handleError(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      internalErrorMessage
    );
  }
};

const checkSessionExists = async (req, res, next) => {
  try {
    const { userToken } = req.body;
    const sessionExist = await sessionExistsService(userToken);

    if (!sessionExist) {
      return handleError(res, HttpStatus.BAD_REQUEST, sessionNotFoundMessage);
    }

    next();
  } catch (error) {
    console.log(`-- Error in checkSessionExists -> error: `, error.message);
    return handleError(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      internalErrorMessage
    );
  }
};

const validateUserJwt = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return handleError(
        res,
        HttpStatus.UNAUTHORIZED,
        missingTokenErrorMessage
      );
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader;
    const { valid: isTokenValid, userId } = validateJwt(token);

    if (!isTokenValid) {
      return handleError(
        res,
        HttpStatus.UNAUTHORIZED,
        tokenExpiredErrorMessage
      );
    }

    const sessionExist = await sessionExistsService(token);

    if (!sessionExist) {
      return handleError(res, HttpStatus.BAD_REQUEST, sessionNotFoundMessage);
    }

    req.userId = userId;

    next();
  } catch (error) {
    console.log(`-- Error in validateJwt -> error: `, error.message);
    return handleError(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      internalErrorMessage
    );
  }
};

module.exports = {
  checkActiveSessionsLimit,
  checkSessionExists,
  validateUserJwt,
};
