const { asyncHandler, handleError, HttpStatus } = require('@networking/shared');
const User = require('../models/user');
const { ROLES } = require('../constants/roles');
const { createPasswordHash } = require('../services/passwordManager');

exports.signup = asyncHandler(async (req, res) => {
  const { name, userName, password, role = 'operator', area_id } = req.body;

  if (!ROLES.includes(role)) {
    return handleError(res, HttpStatus.BAD_REQUEST, `El rol ${role} no es válido.`);
  }
  if (role === 'super_admin' && area_id) {
    return handleError(res, HttpStatus.BAD_REQUEST, 'super_admin no debe tener un área asignada.');
  }
  if (role !== 'super_admin' && !area_id) {
    return handleError(res, HttpStatus.BAD_REQUEST, 'area_id es requerido para supervisor/operator.');
  }

  const hashedPassword = await createPasswordHash(password);
  const user = await User.create({
    name,
    userName,
    password: hashedPassword,
    role,
    area_id: role === 'super_admin' ? null : area_id,
    avatar: null,
  });

  return res.status(HttpStatus.CREATED).json({
    message: `¡Bienvenido, ${user.name}! Tu cuenta ha sido creada con éxito. c:`,
  });
}, 'Hubo un problema al registrar tu cuenta.');
