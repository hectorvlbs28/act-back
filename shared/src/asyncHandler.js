const { handleError } = require('./handleError');
const HttpStatus = require('./httpStatus');

const asyncHandler =
  (fn, errorMessage = 'Error interno del servidor.') =>
  async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(`[${fn.name}]`, error.message);
      return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, errorMessage);
    }
  };

module.exports = asyncHandler;
