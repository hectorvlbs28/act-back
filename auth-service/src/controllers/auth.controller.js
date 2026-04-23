const { asyncHandler, HttpStatus } = require('@networking/shared');
const Session = require('../models/session');
const { comparePassword } = require('../services/passwordManager');
const { generateJwt } = require('../services/jwtManager');
const { getUserCredentials } = require('../services/usersClient');

exports.signin = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  const user = req.userCredentials ?? (await getUserCredentials(userName));
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

  const { newJwt: userToken, expirationTime } = generateJwt(user._id);

  await Session.create({
    user_id: user._id,
    token: userToken,
    expiration_time: new Date(expirationTime * 1000),
  });

  return res.status(HttpStatus.ACCEPTED).json({
    message: `Inicio de sesión exitoso. ¡Bienvenido, ${user.name}!`,
    user: { _id: user._id, name: user.name, userName: user.userName },
    token: { userToken, tokenExpirationTime: expirationTime },
  });
}, 'Hubo un problema al iniciar sesión.');

exports.signout = asyncHandler(async (req, res) => {
  const { userToken } = req.body;
  await Session.updateOne({ token: userToken }, { deleted: true });
  return res.status(HttpStatus.OK).json({
    message: 'Sesión cerrada correctamente. ¡Hasta pronto!',
  });
}, 'Hubo un problema al cerrar sesión.');
