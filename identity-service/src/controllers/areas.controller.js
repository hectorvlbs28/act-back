const { asyncHandler, handleError, HttpStatus } = require('@networking/shared');
const Area = require('../models/area');
const User = require('../models/user');

// TODO(Fase 2): gatear estos endpoints con requireRole('super_admin') cuando el
// middleware de RBAC compartido esté disponible.

exports.create = asyncHandler(async (req, res) => {
  const { name, description, enabled_modules } = req.body;
  const area = await Area.create({ name, description, enabled_modules });
  return res.status(HttpStatus.CREATED).json({ message: 'Área creada correctamente.', area });
}, 'Hubo un problema al crear el área.');

exports.getAll = asyncHandler(async (_req, res) => {
  const areas = await Area.find();
  return res.status(HttpStatus.OK).json({ areas });
}, 'Hubo un problema al obtener las áreas.');

exports.getById = asyncHandler(async (req, res) => {
  const area = await Area.findById(req.params.id);
  if (!area) return handleError(res, HttpStatus.NOT_FOUND, 'Área no encontrada.');
  return res.status(HttpStatus.OK).json({ area });
}, 'Hubo un problema al obtener el área.');

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, enabled_modules, status } = req.body;

  const area = await Area.findById(id);
  if (!area) return handleError(res, HttpStatus.NOT_FOUND, 'Área no encontrada.');

  // Regla de negocio: un área no puede darse de baja mientras tenga usuarios activos asignados.
  if (status === 'deactivated' && area.status !== 'deactivated') {
    const activeUsersCount = await User.countDocuments({ area_id: id, deleted: false });
    if (activeUsersCount > 0) {
      return handleError(
        res,
        HttpStatus.BAD_REQUEST,
        'No se puede dar de baja el área: tiene usuarios activos asignados. Reasígnalos o dalos de baja primero.'
      );
    }
  }

  if (name !== undefined) area.name = name;
  if (description !== undefined) area.description = description;
  if (enabled_modules !== undefined) area.enabled_modules = enabled_modules;
  if (status !== undefined) area.status = status;

  await area.save();
  return res.status(HttpStatus.OK).json({ message: 'Área actualizada correctamente.', area });
}, 'Hubo un problema al actualizar el área.');
