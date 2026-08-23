const { asyncHandler, handleError, HttpStatus } = require('@networking/shared');
const Password = require('../models/password');
const { encrypt, decrypt } = require('../utils/cryptoManager');

const VISIBILITIES = ['private', 'area', 'global'];

const buildVisibilityFilter = (req) => {
  const or = [{ owner_id: req.userId }, { visibility: 'global' }];
  if (req.userRole === 'super_admin') {
    or.push({ visibility: 'area' });
  } else if (req.userAreaId) {
    or.push({ visibility: 'area', area_id: req.userAreaId });
  }
  return { deleted: false, $or: or };
};

exports.create = asyncHandler(async (req, res) => {
  const { name: pswd_name, password: pswd_value, description: pswd_description, visibility } = req.body;

  if (!VISIBILITIES.includes(visibility)) {
    return handleError(res, HttpStatus.BAD_REQUEST, 'visibility es requerido y debe ser "private", "area" o "global".');
  }

  let area_id = null;
  if (visibility === 'area') {
    if (!req.userAreaId) {
      return handleError(
        res,
        HttpStatus.BAD_REQUEST,
        'No se puede crear una contraseña de área: tu usuario no tiene área asignada.'
      );
    }
    area_id = req.userAreaId;
  }

  const { encrypted, ivHex: pswd_ivhex } = encrypt(pswd_value);
  await Password.create({
    pswd_value: encrypted,
    pswd_name,
    pswd_description,
    pswd_ivhex,
    owner_id: req.userId,
    visibility,
    area_id,
  });
  return res.status(HttpStatus.CREATED).json({ message: 'Contraseña creada correctamente.' });
}, 'Hubo un problema al registrar la contraseña.');

exports.getAll = asyncHandler(async (req, res) => {
  const filter = buildVisibilityFilter(req);
  const passwordsList = await Password.find(filter, {
    pswd_name: 1,
    pswd_description: 1,
    updatedAt: 1,
    visibility: 1,
    owner_id: 1,
    area_id: 1,
  }).sort({ updatedAt: -1 });
  return res.status(HttpStatus.OK).json({ message: 'Contraseñas obtenidas con éxito.', passwordsList });
}, 'Hubo un problema al obtener las contraseñas.');

exports.getValue = asyncHandler(async (req, res) => {
  const decrypted = decrypt(req.password.pswd_value, req.password.pswd_ivhex);
  return res.status(HttpStatus.OK).json({ message: 'Contraseña obtenida con éxito.', password: decrypted });
}, 'Hubo un problema al obtener la contraseña.');

exports.remove = asyncHandler(async (req, res) => {
  await req.password.updateOne({ deleted: true });
  return res.status(HttpStatus.OK).json({ message: 'Contraseña eliminada correctamente.' });
}, 'Hubo un problema al eliminar la contraseña.');

exports.update = asyncHandler(async (req, res) => {
  const { name: pswd_name, password: pswd_value, description: pswd_description, visibility } = req.body;
  const updateDoc = {};

  if (pswd_name !== undefined) updateDoc.pswd_name = pswd_name;
  if (pswd_description !== undefined) updateDoc.pswd_description = pswd_description;
  if (pswd_value !== undefined) {
    const { encrypted, ivHex } = encrypt(pswd_value);
    updateDoc.pswd_value = encrypted;
    updateDoc.pswd_ivhex = ivHex;
  }
  if (visibility !== undefined) {
    if (!VISIBILITIES.includes(visibility)) {
      return handleError(res, HttpStatus.BAD_REQUEST, 'visibility debe ser "private", "area" o "global".');
    }
    updateDoc.visibility = visibility;
    updateDoc.area_id = visibility === 'area' ? req.userAreaId : null;
  }

  await req.password.updateOne(updateDoc);
  return res.status(HttpStatus.OK).json({ message: 'Contraseña actualizada correctamente.' });
}, 'Hubo un problema al actualizar la contraseña.');

exports.purgePrivate = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { deletedCount } = await Password.deleteMany({ owner_id: userId, visibility: 'private' });
  return res.status(HttpStatus.OK).json({ message: 'Contraseñas privadas eliminadas correctamente.', deletedCount });
}, 'Hubo un problema al purgar las contraseñas privadas del usuario.');
