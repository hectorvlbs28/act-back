const Password = require('../models/password');
const { encrypt, decrypt } = require('../utils/cryptoManager');
const { handleError } = require('../utils/handleError');
const HttpStatus = require('../utils/httpStatus');

exports.create = async (req, res) => {
  try {
    const { name: pswd_name, password: pswd_value, description: pswd_description } = req.body;
    const { encrypted, ivHex: pswd_ivhex } = encrypt(pswd_value);

    await Password.create({
      user_id: req.userId,
      pswd_value: encrypted,
      pswd_name,
      pswd_description,
      pswd_ivhex,
    });

    return res.status(HttpStatus.CREATED).json({
      message: 'Contraseña creada correctamente.',
    });
  } catch (error) {
    console.error('Error en create:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Hubo un problema al registrar la contraseña.');
  }
};

exports.getAll = async (req, res) => {
  try {
    const passwordsList = await Password.find(
      { user_id: req.userId, deleted: false },
      { pswd_name: 1, pswd_description: 1, updatedAt: 1 }
    ).sort({ updatedAt: -1 });

    return res.status(HttpStatus.OK).json({
      message: 'Contraseñas obtenidas con éxito.',
      passwordsList,
    });
  } catch (error) {
    console.error('Error en getAll:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Hubo un problema al obtener las contraseñas.');
  }
};

exports.getValue = async (req, res) => {
  try {
    const { pswd_value, pswd_ivhex } = req.password;
    const decrypted = decrypt(pswd_value, pswd_ivhex);

    return res.status(HttpStatus.OK).json({
      message: 'Contraseña obtenida con éxito.',
      password: decrypted,
    });
  } catch (error) {
    console.error('Error en getValue:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Hubo un problema al obtener la contraseña.');
  }
};

exports.remove = async (req, res) => {
  try {
    await Password.findByIdAndUpdate(req.params.id, { deleted: true });

    return res.status(HttpStatus.OK).json({
      message: 'Contraseña eliminada correctamente.',
    });
  } catch (error) {
    console.error('Error en remove:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Hubo un problema al eliminar la contraseña.');
  }
};

exports.update = async (req, res) => {
  try {
    const { name: pswd_name, password: pswd_value, description: pswd_description } = req.body;
    const { encrypted, ivHex: pswd_ivhex } = encrypt(pswd_value);

    await Password.findByIdAndUpdate(req.params.id, {
      pswd_name,
      pswd_description,
      pswd_value: encrypted,
      pswd_ivhex,
    });

    return res.status(HttpStatus.OK).json({
      message: 'Contraseña actualizada correctamente.',
    });
  } catch (error) {
    console.error('Error en update:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Hubo un problema al actualizar la contraseña.');
  }
};
