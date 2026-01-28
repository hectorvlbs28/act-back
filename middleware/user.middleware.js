const { isUserRegisteredService } = require('../services/database/user');
const { userNameRegisteredMessage, internalErrorMessage, userDoesNotExistMessage } = require('../utils/errorMessages');
const { handleError } = require('../utils/handleError');
const HttpStatus = require('../utils/httpStatus');

const handleUserNameCheck = async (req, res, next, checkFn, errorMessageFn) => {
  try {
    const { userName } = req.body;
    const userNameRegistered = await isUserRegisteredService(userName);

    if (checkFn(userNameRegistered)) {
      console.log(`-- Error in ${errorMessageFn.name} -> userName: `, userName, errorMessageFn(userName));
      return handleError(res, HttpStatus.BAD_REQUEST, errorMessageFn(userName));
    }

    next();
  } catch (error) {
    console.log(`-- Error in ${errorMessageFn.name} -> error: `, error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, internalErrorMessage);
  }
};

const validateUserRegistered = (req, res, next) => {
  handleUserNameCheck(req, res, next, (userNameRegistered) => userNameRegistered, userNameRegisteredMessage);
};

const verifyUserExists = (req, res, next) => {
  handleUserNameCheck(req, res, next, (userNameRegistered) => !userNameRegistered, userDoesNotExistMessage);
};

module.exports = { validateUserRegistered, verifyUserExists };
