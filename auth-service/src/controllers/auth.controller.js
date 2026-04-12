const Session = require('../models/session');
const { comparePassword } = require('../services/passwordManager');
const { generateJwt } = require('../services/jwtManager');
const { getUserCredentials } = require('../services/usersClient');
const { handleError } = require('../utils/handleError');
const HttpStatus = require('../utils/httpStatus');

exports.signin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = req.userCredentials ?? (await getUserCredentials(userName));
    if (!user) {
      return handleError(res, HttpStatus.BAD_REQUEST, 'El usuario no está asociado a ninguna cuenta.');
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return handleError(res, HttpStatus.UNAUTHORIZED, 'La contraseña ingresada es incorrecta.');
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
      token: {
        userToken,
        tokenExpirationTime: expirationTime,
      },
    });
  } catch (error) {
    console.error('Error en signin:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Hubo un problema al iniciar sesión.');
  }
};

exports.signout = async (req, res) => {
  try {
    const { userToken } = req.body;
    await Session.updateOne({ token: userToken }, { deleted: true });
    return res.status(HttpStatus.OK).json({
      message: 'Sesión cerrada correctamente. ¡Hasta pronto!',
    });
  } catch (error) {
    console.error('Error en signout:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Hubo un problema al cerrar sesión.');
  }
};
