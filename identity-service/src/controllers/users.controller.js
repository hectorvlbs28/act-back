const { asyncHandler, handleError, HttpStatus } = require('@networking/shared');
const User = require('../models/user');
const { ROLES } = require('../constants/roles');
const { createPasswordHash } = require('../services/passwordManager');
const { invalidateUserSessions } = require('../services/sessionManager');
const { getAdminAreaId } = require('../services/adminAreaCache');

exports.signup = asyncHandler(async (req, res) => {
  const { name, userName, password, role = 'operator', area_id } = req.body;

  if (!ROLES.includes(role)) {
    return handleError(res, HttpStatus.BAD_REQUEST, `El rol ${role} no es válido.`);
  }
  if (req.userRole !== 'super_admin' && role !== 'operator') {
    return handleError(res, HttpStatus.FORBIDDEN, 'Solo un super_admin puede asignar ese rol.');
  }

  const adminAreaId = await getAdminAreaId();
  let resolvedAreaId;
  if (role === 'super_admin') {
    resolvedAreaId = adminAreaId;
  } else {
    if (!area_id) {
      return handleError(res, HttpStatus.BAD_REQUEST, 'area_id es requerido para supervisor/operator.');
    }
    if (String(area_id) === String(adminAreaId)) {
      return handleError(res, HttpStatus.BAD_REQUEST, 'El área Admin está reservada para super_admin.');
    }
    resolvedAreaId = area_id;
  }

  const hashedPassword = await createPasswordHash(password);
  const user = await User.create({
    name,
    userName,
    password: hashedPassword,
    role,
    area_id: resolvedAreaId,
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

  const resultingRole = role !== undefined ? role : user.role;
  const adminAreaId = await getAdminAreaId();
  let resolvedAreaId = area_id !== undefined ? area_id : user.area_id;

  if (resultingRole === 'super_admin') {
    resolvedAreaId = adminAreaId;
  } else if (String(resolvedAreaId) === String(adminAreaId)) {
    return handleError(
      res,
      HttpStatus.BAD_REQUEST,
      'El área Admin está reservada para super_admin; asigna un área distinta.'
    );
  }

  const roleChanged = role !== undefined && role !== user.role;
  // No depende de `area_id !== undefined`: promover a super_admin cambia el área
  // implícitamente aunque el body no la incluya.
  const areaChanged = String(resolvedAreaId) !== String(user.area_id);
  const deactivated = deleted === true && user.deleted !== true;
  const sensitiveChange = roleChanged || areaChanged || deactivated;

  const losesActiveSuperAdmin =
    user.role === 'super_admin' && ((roleChanged && resultingRole !== 'super_admin') || deactivated);
  if (losesActiveSuperAdmin) {
    const otherActiveSuperAdmins = await User.countDocuments({
      role: 'super_admin',
      deleted: false,
      _id: { $ne: user._id },
    });
    if (otherActiveSuperAdmins === 0) {
      return handleError(
        res,
        HttpStatus.BAD_REQUEST,
        'No se puede completar la acción: el sistema quedaría sin ningún super_admin activo.'
      );
    }
  }

  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  user.area_id = resolvedAreaId;
  if (deleted !== undefined) user.deleted = deleted;

  await user.save();

  if (sensitiveChange) {
    await invalidateUserSessions(user._id);
  }

  if (deactivated) {
    try {
      const response = await fetch(`${process.env.PASSWORDS_SERVICE_URL}/internal/purge-private/${user._id}`, {
        method: 'DELETE',
        headers: { authorization: req.headers.authorization },
      });
      if (!response.ok) {
        console.error(`purge-private respondió ${response.status} para user ${user._id}`);
      }
    } catch (error) {
      console.error(`No se pudo purgar contraseñas privadas de ${user._id}:`, error.message);
    }
  }

  return res.status(HttpStatus.OK).json({ message: 'Usuario actualizado correctamente.', user });
}, 'Hubo un problema al actualizar el usuario.');
