const express = require('express');
const router = express.Router();
const controller = require('../controllers/passwords.controller');
const { validateUserJwt } = require('../middleware/auth.middleware');
const { checkPasswordStatus } = require('../middleware/password.middleware');

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Crea una contraseña nueva (cifrada en reposo)
 *     tags: [Passwords]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, password]
 *             properties:
 *               name: { type: string }
 *               password: { type: string, format: password }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Contraseña creada correctamente
 */
router.post('/create', [validateUserJwt], controller.create);

/**
 * @swagger
 * /get/all:
 *   get:
 *     summary: Lista las contraseñas activas (nombre, descripción y fecha, sin el valor)
 *     tags: [Passwords]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Listado de contraseñas
 */
router.get('/get/all', [validateUserJwt], controller.getAll);

/**
 * @swagger
 * /get/value/{id}:
 *   get:
 *     summary: Obtiene el valor descifrado de una contraseña
 *     tags: [Passwords]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Valor de la contraseña descifrado
 *       400:
 *         description: La contraseña fue eliminada
 *       404:
 *         description: Contraseña no encontrada
 */
router.get('/get/value/:id', [validateUserJwt, checkPasswordStatus], controller.getValue);

/**
 * @swagger
 * /delete/value/{id}:
 *   put:
 *     summary: Elimina (soft-delete) una contraseña
 *     tags: [Passwords]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contraseña eliminada correctamente
 *       400:
 *         description: La contraseña ya fue eliminada
 *       404:
 *         description: Contraseña no encontrada
 */
router.put('/delete/value/:id', [validateUserJwt, checkPasswordStatus], controller.remove);

/**
 * @swagger
 * /update/value/{id}:
 *   put:
 *     summary: Actualiza nombre, descripción y/o valor de una contraseña
 *     tags: [Passwords]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               password: { type: string, format: password }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: La contraseña fue eliminada
 *       404:
 *         description: Contraseña no encontrada
 */
router.put('/update/value/:id', [validateUserJwt, checkPasswordStatus], controller.update);

module.exports = router;
