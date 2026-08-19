const express = require('express');
const router = express.Router();
const controller = require('../controllers/areas.controller');
const { validateUserJwt } = require('../middleware/validate.middleware');
const { requireRole } = require('@networking/shared');

/**
 * @swagger
 * /areas/create:
 *   post:
 *     summary: Crea una nueva área (exclusivo super_admin)
 *     tags: [Areas]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               enabled_modules:
 *                 type: array
 *                 items: { type: string }
 *                 default: [password_manager]
 *     responses:
 *       201:
 *         description: Área creada correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Rol insuficiente
 */
router.post('/create', [validateUserJwt, requireRole('super_admin')], controller.create);

/**
 * @swagger
 * /areas/get/all:
 *   get:
 *     summary: Lista todas las áreas
 *     tags: [Areas]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Listado de áreas
 *       401:
 *         description: No autenticado
 */
router.get('/get/all', [validateUserJwt], controller.getAll);

/**
 * @swagger
 * /areas/get/{id}:
 *   get:
 *     summary: Obtiene un área por id
 *     tags: [Areas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Área encontrada
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Área no encontrada
 */
router.get('/get/:id', [validateUserJwt], controller.getById);

/**
 * @swagger
 * /areas/update/{id}:
 *   put:
 *     summary: Actualiza un área (exclusivo super_admin)
 *     tags: [Areas]
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
 *               description: { type: string }
 *               enabled_modules:
 *                 type: array
 *                 items: { type: string }
 *               status:
 *                 type: string
 *                 enum: [active, deactivated]
 *     responses:
 *       200:
 *         description: Área actualizada correctamente
 *       400:
 *         description: No se puede dar de baja un área con usuarios activos asignados
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Rol insuficiente
 *       404:
 *         description: Área no encontrada
 */
router.put('/update/:id', [validateUserJwt, requireRole('super_admin')], controller.update);

module.exports = router;
