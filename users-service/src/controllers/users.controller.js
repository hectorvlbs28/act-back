const bcrypt = require('bcryptjs');
const { asyncHandler, HttpStatus } = require('@networking/shared');
const User = require('../models/user');

const SALT_ROUNDS = 10;

exports.signup = asyncHandler(async (req, res) => {
  const { name, userName, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, userName, password: hashedPassword });
  return res.status(HttpStatus.CREATED).json({
    message: `¡Bienvenido, ${user.name}! Tu cuenta ha sido creada con éxito. c:`,
  });
}, 'Hubo un problema al registrar tu cuenta.');
