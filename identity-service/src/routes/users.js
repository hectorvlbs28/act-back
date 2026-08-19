const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const { validateUserRegistered } = require('../middleware/user.middleware');
const { validateUserJwt } = require('../middleware/validate.middleware');
const { requireRole, requireSameAreaOrSuperAdmin } = require('@networking/shared');
const { resolveUserByParamId, resolveSignupBodyAreaId } = require('../middleware/rbac.resolvers');

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Registra un nuevo usuario (alta cerrada — solo super_admin o supervisor de esa área)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
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
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Rol insuficiente, área ajena, o intento de asignar un rol elevado sin ser super_admin
 */
router.post(
  '/signup',
  [
    validateUserJwt,
    requireRole('super_admin', 'supervisor'),
    requireSameAreaOrSuperAdmin(resolveSignupBodyAreaId),
    validateUserRegistered,
  ],
  controller.signup
);

/**
 * @swagger
 * /users/get/all:
 *   get:
 *     summary: Lista los usuarios (super_admin ve todos, el resto solo los de su área)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Listado de usuarios
 *       401:
 *         description: No autenticado
 */
router.get('/get/all', [validateUserJwt], controller.getAll);

/**
 * @swagger
 * /users/get/{id}:
 *   get:
 *     summary: Obtiene un usuario por id (solo de tu área, salvo super_admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: El usuario pertenece a otra área
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/get/:id', [validateUserJwt, requireSameAreaOrSuperAdmin(resolveUserByParamId)], controller.getById);

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Edita o da de baja un usuario (reglas de rol/área aplican)
 *     tags: [Users]
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
 *               role:
 *                 type: string
 *                 enum: [super_admin, supervisor, operator]
 *               area_id: { type: string }
 *               deleted: { type: boolean }
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: area_id/role inconsistentes según el validador del modelo
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Rol insuficiente, área ajena, o intento de tocar a un supervisor/asignar rol elevado sin ser super_admin
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
  '/update/:id',
  [validateUserJwt, requireRole('super_admin', 'supervisor'), requireSameAreaOrSuperAdmin(resolveUserByParamId)],
  controller.update
);

module.exports = router;
