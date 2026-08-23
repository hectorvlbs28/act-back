const express = require('express');
const router = express.Router();
const controller = require('../controllers/passwords.controller');
const { validateUserJwt } = require('../middleware/auth.middleware');
const { requireRole } = require('@networking/shared');
const { checkPasswordStatus, checkPasswordVisible, checkPasswordOwner } = require('../middleware/password.middleware');

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
 *             required: [name, password, visibility]
 *             properties:
 *               name: { type: string }
 *               password: { type: string, format: password }
 *               description: { type: string }
 *               visibility:
 *                 type: string
 *                 enum: [private, area, global]
 *                 description: private = solo el creador; area = tu propia área; global = cualquier usuario autenticado
 *     responses:
 *       201:
 *         description: Contraseña creada correctamente
 *       400:
 *         description: visibility faltante/inválida, o el usuario no tiene área asignada
 */
router.post('/create', [validateUserJwt], controller.create);

/**
 * @swagger
 * /get/all:
 *   get:
 *     summary: Lista las contraseñas visibles para el usuario (nombre, descripción y fecha, sin el valor)
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
 *     summary: Obtiene el valor descifrado de una contraseña (sujeto a su visibilidad)
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
 *       403:
 *         description: No tienes permiso para ver esta contraseña
 *       404:
 *         description: Contraseña no encontrada
 */
router.get('/get/value/:id', [validateUserJwt, checkPasswordStatus, checkPasswordVisible], controller.getValue);

/**
 * @swagger
 * /delete/value/{id}:
 *   put:
 *     summary: Elimina (soft-delete) una contraseña (exclusivo del creador)
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
 *       403:
 *         description: Solo el creador puede eliminarla
 *       404:
 *         description: Contraseña no encontrada
 */
router.put('/delete/value/:id', [validateUserJwt, checkPasswordStatus, checkPasswordOwner], controller.remove);

/**
 * @swagger
 * /update/value/{id}:
 *   put:
 *     summary: Actualiza nombre, descripción, valor y/o categoría de una contraseña (exclusivo del creador)
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
 *               visibility:
 *                 type: string
 *                 enum: [private, area, global]
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: La contraseña fue eliminada, o visibility inválida
 *       403:
 *         description: Solo el creador puede editarla
 *       404:
 *         description: Contraseña no encontrada
 */
router.put('/update/value/:id', [validateUserJwt, checkPasswordStatus, checkPasswordOwner], controller.update);

/**
 * @swagger
 * /internal/purge-private/{userId}:
 *   delete:
 *     summary: Elimina definitivamente las contraseñas privadas de un usuario (uso interno, llamado por identity-service al dar de baja a un usuario)
 *     tags: [Internal]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contraseñas privadas eliminadas correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Rol insuficiente
 */
router.delete(
  '/internal/purge-private/:userId',
  [validateUserJwt, requireRole('super_admin', 'supervisor')],
  controller.purgePrivate
);

module.exports = router;
