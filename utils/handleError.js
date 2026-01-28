const HttpStatus = require('./httpStatus');
const { internalErrorMessage } = require('./errorMessages');

const handleError = (res, status, message) => {
  return res.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: message || internalErrorMessage });
};

module.exports = { handleError };
