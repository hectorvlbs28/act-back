const HttpStatus = require("../utils/httpStatus");
const { handleError } = require("../utils/handleError");
const {
  isPasswordDeletedService,
  doesPasswordExistService,
} = require("../services/database/passwords");
const {
  internalErrorMessage,
  deletedPasswordErrorMessage,
  passwordNotFound,
  emptyPasswordIdErrorMessage,
} = require("../utils/errorMessages");

const checkPasswordSatus = async (req, res, next) => {
  try {
    const { id: password_id } = req.params;

    if (!password_id) {
      return handleError(
        res,
        HttpStatus.BAD_REQUEST,
        emptyPasswordIdErrorMessage
      );
    }

    const [doesPasswordExist, isPasswordDeleted] = await Promise.all([
      doesPasswordExistService(password_id),
      isPasswordDeletedService(password_id),
    ]);

    if (!doesPasswordExist) {
      return handleError(res, HttpStatus.BAD_REQUEST, passwordNotFound);
    }

    if (isPasswordDeleted) {
      return handleError(
        res,
        HttpStatus.BAD_REQUEST,
        deletedPasswordErrorMessage
      );
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

module.exports = { checkPasswordSatus };
