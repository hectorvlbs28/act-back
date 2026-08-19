const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const { validateUserRegistered } = require('../middleware/user.middleware');

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Registra un nuevo usuario (alta cerrada — no es autoservicio público)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, userName, password]
 *             properties:
 *               name: { type: string }
 *               userName: { type: string }
 *               password: { type: string, format: password }
 *               role:
 *                 type: string
 *                 enum: [super_admin, supervisor, operator]
 *                 default: operator
 *               area_id:
 *                 type: string
 *                 description: Requerido salvo que role sea super_admin
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Usuario ya registrado, rol inválido, o area_id inconsistente con el rol
 */
router.post('/signup', [validateUserRegistered], controller.signup);

module.exports = router;
