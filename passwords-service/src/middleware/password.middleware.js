const { handleError, HttpStatus } = require('@networking/shared');
const Password = require('../models/password');

const checkPasswordStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return handleError(res, HttpStatus.BAD_REQUEST, 'No se ha seleccionado una contraseña.');
    }

    const password = await Password.findById(id);
    if (!password) {
      return handleError(res, HttpStatus.NOT_FOUND, 'No se encontraron registros de la contraseña seleccionada.');
    }

    if (password.deleted) {
      return handleError(res, HttpStatus.BAD_REQUEST, 'La contraseña ha sido eliminada y no puede ser consultada.');
    }

    req.password = password;
    next();
  } catch (error) {
    console.error('Error en checkPasswordStatus:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Error verificando la contraseña.');
  }
};

// Exige permiso de lectura sobre req.password (ya cargado por checkPasswordStatus)
// según su visibilidad. Las privadas de otros nunca pasan, sin excepción de rol.
const checkPasswordVisible = (req, res, next) => {
  const { owner_id, visibility, area_id } = req.password;
  const isOwner = String(owner_id) === String(req.userId);

  if (isOwner || visibility === 'global') return next();

  if (visibility === 'area') {
    if (req.userRole === 'super_admin') return next();
    if (req.userAreaId && String(area_id) === String(req.userAreaId)) return next();
  }

  return handleError(res, HttpStatus.FORBIDDEN, 'No tienes permiso para ver esta contraseña.');
};

// Edición/eliminación son exclusivas del creador, sin excepción de rol.
const checkPasswordOwner = (req, res, next) => {
  if (String(req.password.owner_id) !== String(req.userId)) {
    return handleError(res, HttpStatus.FORBIDDEN, 'Solo el creador de la contraseña puede editarla o eliminarla.');
  }
  next();
};

module.exports = { checkPasswordStatus, checkPasswordVisible, checkPasswordOwner };
