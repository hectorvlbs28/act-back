const express = require('express');
const router = express.Router();
const controller = require('../controllers/areas.controller');

/**
 * @swagger
 * /areas/create:
 *   post:
 *     summary: Crea una nueva área (exclusivo super_admin — RBAC pendiente de Fase 2)
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
 */
router.post('/create', controller.create);

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
 */
router.get('/get/all', controller.getAll);

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
 *       404:
 *         description: Área no encontrada
 */
router.get('/get/:id', controller.getById);

/**
 * @swagger
 * /areas/update/{id}:
 *   put:
 *     summary: Actualiza un área (exclusivo super_admin — RBAC pendiente de Fase 2)
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
 *       404:
 *         description: Área no encontrada
 */
router.put('/update/:id', controller.update);

module.exports = router;
