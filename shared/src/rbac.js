const { handleError } = require('./handleError');
const HttpStatus = require('./httpStatus');

const requireRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.userRole) {
      return handleError(res, HttpStatus.UNAUTHORIZED, 'No tienes autorización para ejecutar este servicio.');
    }
    if (!allowedRoles.includes(req.userRole)) {
      return handleError(res, HttpStatus.FORBIDDEN, 'No tienes permisos para realizar esta acción.');
    }
    next();
  };

// resolveTarget: async (req) => null | { areaId, resource? }
// null -> 404. { resource } se cuelga en req.targetResource para que el controller lo reutilice.
const requireSameAreaOrSuperAdmin = (resolveTarget) => async (req, res, next) => {
  try {
    const result = await resolveTarget(req);
    if (result === null) {
      return handleError(res, HttpStatus.NOT_FOUND, 'Recurso no encontrado.');
    }

    const { areaId, resource } = result;
    if (resource !== undefined) req.targetResource = resource;

    if (req.userRole === 'super_admin') return next();

    if (!req.userAreaId || String(areaId) !== String(req.userAreaId)) {
      return handleError(res, HttpStatus.FORBIDDEN, 'No tienes permisos sobre este recurso.');
    }
    next();
  } catch (error) {
    console.error('Error en requireSameAreaOrSuperAdmin:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Error verificando permisos de área.');
  }
};

module.exports = { requireRole, requireSameAreaOrSuperAdmin };
