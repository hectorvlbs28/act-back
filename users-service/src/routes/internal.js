const express = require('express');
const router = express.Router();
const { handleError, HttpStatus } = require('@networking/shared');
const User = require('../models/user');

router.get('/credentials', async (req, res) => {
  try {
    const { userName } = req.query;
    if (!userName) {
      return handleError(res, HttpStatus.BAD_REQUEST, 'El parámetro userName es requerido.');
    }

    const user = await User.findOne({ userName, deleted: false });
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Usuario no encontrado.' });
    }

    return res.status(HttpStatus.OK).json({
      _id: user._id,
      name: user.name,
      userName: user.userName,
      password: user.password,
    });
  } catch (error) {
    console.error('Error en /internal/credentials:', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Error obteniendo credenciales.');
  }
});

module.exports = router;
