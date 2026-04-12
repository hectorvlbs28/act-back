const express = require('express');
const router = express.Router();
const { validateUserJwt } = require('../middleware/validate.middleware');

router.post('/', validateUserJwt, (req, res) => {
  res.status(200).json({ valid: true, userId: req.userId });
});

module.exports = router;
