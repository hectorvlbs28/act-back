const { asyncHandler, handleError, HttpStatus } = require('@networking/shared');
const User = require('../models/user');
const { ROLES } = require('../constants/roles');
const { createPasswordHash } = require('../services/passwordManager');
const { invalidateUserSessions } = require('../services/sessionManager');

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
  if (req.userRole !== 'super_admin' && role !== 'operator') {
    return handleError(res, HttpStatus.FORBIDDEN, 'Solo un super_admin puede asignar ese rol.');
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

exports.getAll = asyncHandler(async (req, res) => {
  const filter = { deleted: false };
  if (req.userRole !== 'super_admin') filter.area_id = req.userAreaId;

  const users = await User.find(filter).select('-password');
  return res.status(HttpStatus.OK).json({ users });
}, 'Hubo un problema al obtener los usuarios.');

exports.getById = asyncHandler(async (req, res) => {
  return res.status(HttpStatus.OK).json({ user: req.targetResource });
}, 'Hubo un problema al obtener el usuario.');

exports.update = asyncHandler(async (req, res) => {
  const { name, role, area_id, deleted } = req.body;
  const user = req.targetResource;

  if (req.userRole !== 'super_admin') {
    if (user.role === 'supervisor') {
      return handleError(
        res,
        HttpStatus.FORBIDDEN,
        'Solo un super_admin puede editar o dar de baja a un supervisor.'
      );
    }
    if (role !== undefined && role !== 'operator') {
      return handleError(res, HttpStatus.FORBIDDEN, 'Solo un super_admin puede asignar ese rol.');
    }
  }

  const roleChanged = role !== undefined && role !== user.role;
  const areaChanged = area_id !== undefined && String(area_id) !== String(user.area_id);
  const deactivated = deleted === true && user.deleted !== true;
  const sensitiveChange = roleChanged || areaChanged || deactivated;

  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (area_id !== undefined) user.area_id = user.role === 'super_admin' ? null : area_id;
  if (deleted !== undefined) user.deleted = deleted;

  await user.save();

  if (sensitiveChange) {
    await invalidateUserSessions(user._id);
  }

  return res.status(HttpStatus.OK).json({ message: 'Usuario actualizado correctamente.', user });
}, 'Hubo un problema al actualizar el usuario.');
