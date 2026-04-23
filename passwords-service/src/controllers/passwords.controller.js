const { asyncHandler, HttpStatus } = require('@networking/shared');
const Password = require('../models/password');
const { encrypt, decrypt } = require('../utils/cryptoManager');

exports.create = asyncHandler(async (req, res) => {
  const { name: pswd_name, password: pswd_value, description: pswd_description } = req.body;
  const { encrypted, ivHex: pswd_ivhex } = encrypt(pswd_value);
  await Password.create({ user_id: req.userId, pswd_value: encrypted, pswd_name, pswd_description, pswd_ivhex });
  return res.status(HttpStatus.CREATED).json({ message: 'Contraseña creada correctamente.' });
}, 'Hubo un problema al registrar la contraseña.');

exports.getAll = asyncHandler(async (req, res) => {
  const passwordsList = await Password.find(
    { user_id: req.userId, deleted: false },
    { pswd_name: 1, pswd_description: 1, updatedAt: 1 }
  ).sort({ updatedAt: -1 });
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
  const { name: pswd_name, password: pswd_value, description: pswd_description } = req.body;
  const { encrypted, ivHex: pswd_ivhex } = encrypt(pswd_value);
  await req.password.updateOne({ pswd_name, pswd_description, pswd_value: encrypted, pswd_ivhex });
  return res.status(HttpStatus.OK).json({ message: 'Contraseña actualizada correctamente.' });
}, 'Hubo un problema al actualizar la contraseña.');
