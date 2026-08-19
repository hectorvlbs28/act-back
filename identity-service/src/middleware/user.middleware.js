const { handleError, HttpStatus } = require('@networking/shared');
const User = require('../models/user');

const validateUserRegistered = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const exists = await User.findOne({ userName, deleted: false });
    if (exists) {
      return handleError(
        res,
        HttpStatus.BAD_REQUEST,
        `El nombre de usuario ${userName} ya está registrado. Intenta con otro o inicia sesión.`
      );
    }
    next();
  } catch (error) {
    console.error('Error en validateUserRegistered:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Error verificando el usuario.');
  }
};

module.exports = { validateUserRegistered };
