const { handleError } = require('../utils/handleError');
const HttpStatus = require('../utils/httpStatus');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

const validateUserJwt = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return handleError(res, HttpStatus.UNAUTHORIZED, 'No tienes autorización para ejecutar este servicio.');
    }

    const response = await fetch(`${AUTH_SERVICE_URL}/validate`, {
      method: 'POST',
      headers: { authorization: authHeader },
    });

    if (!response.ok) {
      const data = await response.json();
      return handleError(res, response.status, data.message);
    }

    const { userId } = await response.json();
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Error validando token con auth-service:', error.message);
    return handleError(res, HttpStatus.SERVICE_UNAVAILABLE, 'No se pudo verificar la sesión. Intenta más tarde.');
  }
};

module.exports = { validateUserJwt };
