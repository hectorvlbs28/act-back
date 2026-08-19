const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { checkActiveSessionsLimit, checkSessionExists } = require('../middleware/sessions.middleware');

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Inicia sesión con usuario y contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userName, password]
 *             properties:
 *               userName: { type: string }
 *               password: { type: string, format: password }
 *     responses:
 *       202:
 *         description: Sesión iniciada correctamente, devuelve el token
 *       400:
 *         description: El usuario no existe
 *       401:
 *         description: Contraseña incorrecta o límite de sesiones activas alcanzado
 */
router.post('/signin', [checkActiveSessionsLimit], controller.signin);

/**
 * @swagger
 * /auth/signout:
 *   put:
 *     summary: Cierra la sesión activa asociada al token enviado
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       401:
 *         description: Token no proporcionado o sesión inexistente
 */
router.put('/signout', [checkSessionExists], controller.signout);

module.exports = router;
