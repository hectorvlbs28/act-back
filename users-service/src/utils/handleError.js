const HttpStatus = require('./httpStatus');

const handleError = (res, status, message) =>
  res.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: message || 'Error interno del servidor.' });

module.exports = { handleError };
