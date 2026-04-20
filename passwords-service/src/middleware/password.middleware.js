const Password = require('../models/password');
const { handleError } = require('../utils/handleError');
const HttpStatus = require('../utils/httpStatus');

const checkPasswordStatus = async (req, res, next) => {
  try {
    const { id: password_id } = req.params;

    if (!password_id) {
      return handleError(res, HttpStatus.BAD_REQUEST, 'No se ha seleccionado una contraseña.');
    }

    const password = await Password.findById(password_id);

    if (!password) {
      return handleError(res, HttpStatus.NOT_FOUND, 'No se encontraron registros de la contraseña seleccionada.');
    }

    if (password.deleted) {
      return handleError(res, HttpStatus.BAD_REQUEST, 'La contraseña ha sido eliminada y no puede ser consultada.');
    }

    req.password = password;
    next();
  } catch (error) {
    console.error('Error en checkPasswordStatus:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Error verificando la contraseña.');
  }
};

module.exports = { checkPasswordStatus };
