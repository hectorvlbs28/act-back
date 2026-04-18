const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { handleError } = require('../utils/handleError');
const HttpStatus = require('../utils/httpStatus');

const SALT_ROUNDS = 10;

exports.signup = async (req, res) => {
  try {
    const { name, userName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, userName, password: hashedPassword });

    return res.status(HttpStatus.CREATED).json({
      message: `¡Bienvenido, ${user.name}! Tu cuenta ha sido creada con éxito.`,
    });
  } catch (error) {
    console.error('Error en signup:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Hubo un problema al registrar tu cuenta.');
  }
};
