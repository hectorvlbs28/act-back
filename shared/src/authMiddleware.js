const { handleError } = require('./handleError');
const HttpStatus = require('./httpStatus');

const createAuthMiddleware = (authServiceUrl) => async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return handleError(res, HttpStatus.UNAUTHORIZED, 'No tienes autorización para ejecutar este servicio.');
    }

    const response = await fetch(`${authServiceUrl}/validate`, {
      method: 'POST',
      headers: { authorization: authHeader },
    });

    if (!response.ok) {
      const data = await response.json();
      return handleError(res, response.status, data.message);
    }

    const { userId, role, area_id } = await response.json();
    req.userId = userId;
    req.userRole = role;
    req.userAreaId = area_id;
    next();
  } catch (error) {
    console.error('Error validando token con auth-service:', error.message);
    return handleError(res, HttpStatus.SERVICE_UNAVAILABLE, 'No se pudo verificar la sesión. Intenta más tarde.');
  }
};

module.exports = { createAuthMiddleware };
