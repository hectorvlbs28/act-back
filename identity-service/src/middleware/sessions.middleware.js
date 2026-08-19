const { handleError, HttpStatus, extractBearerToken } = require('@networking/shared');
const Session = require('../models/session');
const User = require('../models/user');

const LIMIT_SESSIONS = parseInt(process.env.LIMIT_SESSIONS, 10);

const checkActiveSessionsLimit = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const user = await User.findOne({ userName, deleted: false });
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
    const token = extractBearerToken(req);

    if (!token) {
      return handleError(res, HttpStatus.UNAUTHORIZED, 'Token no proporcionado.');
    }

    const session = await Session.findOne({ token, deleted: false }).lean();

    if (!session) {
      return handleError(res, HttpStatus.UNAUTHORIZED, 'No se encontró una sesión activa.');
    }
    req.session = session;
    next();
  } catch (error) {
    console.error('Error en checkSessionExists:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Error verificando la sesión.');
  }
};

module.exports = { checkActiveSessionsLimit, checkSessionExists };
