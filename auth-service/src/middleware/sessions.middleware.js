const { handleError, HttpStatus } = require('@networking/shared');
const Session = require('../models/session');
const { getUserCredentials } = require('../services/usersClient');

const LIMIT_SESSIONS = parseInt(process.env.LIMIT_SESSIONS, 10);

const checkActiveSessionsLimit = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const user = await getUserCredentials(userName);
    if (!user) {
      return handleError(res, HttpStatus.BAD_REQUEST, 'El usuario no existe.');
    }

    const count = await Session.countDocuments({
      user_id: user._id,
      deleted: false,
      expiration_time: { $gt: new Date() },
    });

    if (count >= LIMIT_SESSIONS) {
      return handleError(
        res,
        HttpStatus.UNAUTHORIZED,
        'Se ha alcanzado el límite de sesiones activas. Cierra sesión en otro dispositivo.'
      );
    }

    req.userCredentials = user;
    next();
  } catch (error) {
    console.error('Error en checkActiveSessionsLimit:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Error verificando sesiones activas.');
  }
};

const checkSessionExists = async (req, res, next) => {
  try {
    const { userToken } = req.body;
    const session = await Session.findOne({ token: userToken, deleted: false });
    if (!session) {
      return handleError(res, HttpStatus.BAD_REQUEST, 'No se encontró una sesión activa.');
    }
    next();
  } catch (error) {
    console.error('Error en checkSessionExists:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Error verificando la sesión.');
  }
};

module.exports = { checkActiveSessionsLimit, checkSessionExists };
