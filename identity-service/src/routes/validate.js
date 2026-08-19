const express = require('express');
const router = express.Router();
const { validateUserJwt } = require('../middleware/validate.middleware');

/**
 * @swagger
 * /validate:
 *   post:
 *     summary: Valida un token JWT y su sesión asociada (uso interno entre servicios)
 *     tags: [Internal]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido, expirado, o sin sesión activa
 */
router.post('/', validateUserJwt, (req, res) => {
  res.status(200).json({ valid: true, userId: req.userId });
});

module.exports = router;
