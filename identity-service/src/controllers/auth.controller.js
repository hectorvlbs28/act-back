const { asyncHandler, HttpStatus } = require('@networking/shared');
const Session = require('../models/session');
const User = require('../models/user');
const { comparePassword } = require('../services/passwordManager');
const { generateJwt } = require('../services/jwtManager');

exports.signin = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  const user = req.userCredentials ?? (await User.findOne({ userName, deleted: false }));
  if (!user) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'El usuario no está asociado a ninguna cuenta.',
    });
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'La contraseña ingresada es incorrecta.',
    });
  }

  const { newJwt: userToken, expirationTime } = generateJwt({
    userId: user._id,
    role: user.role,
    area_id: user.area_id,
  });

  await Session.create({
    user_id: user._id,
    token: userToken,
    expiration_time: new Date(expirationTime * 1000),
  });

  return res.status(HttpStatus.ACCEPTED).json({
    message: `Inicio de sesión exitoso. ¡Bienvenido, ${user.name}!`,
    user: { _id: user._id, name: user.name, userName: user.userName, role: user.role, area_id: user.area_id },
    token: { userToken, tokenExpirationTime: expirationTime },
  });
}, 'Hubo un problema al iniciar sesión.');

exports.signout = asyncHandler(async (req, res) => {
  const { token } = req.session;
  await Session.updateOne({ token }, { deleted: true });
  return res.status(HttpStatus.OK).json({
    message: 'Sesión cerrada correctamente. ¡Hasta pronto!',
  });
}, 'Hubo un problema al cerrar sesión.');
