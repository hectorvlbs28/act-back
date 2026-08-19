const { handleError, HttpStatus } = require('@networking/shared');
const Session = require('../models/session');
const { validateJwt } = require('../services/jwtManager');

const validateUserJwt = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return handleError(res, HttpStatus.UNAUTHORIZED, 'No tienes autorización para ejecutar este servicio.');
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;

    const { valid, userId, decoded } = validateJwt(token);
    if (!valid) {
      return handleError(res, HttpStatus.UNAUTHORIZED, 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
    }

    const session = await Session.findOne({ token, deleted: false });
    if (!session) {
      return handleError(res, HttpStatus.UNAUTHORIZED, 'No se encontró una sesión activa.');
    }

    req.userId = userId;
    req.userRole = decoded.role;
    req.userAreaId = decoded.area_id;
    next();
  } catch (error) {
    console.error('Error en validateUserJwt:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Error validando el token.');
  }
};

module.exports = { validateUserJwt };
