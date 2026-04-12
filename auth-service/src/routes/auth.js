const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { checkActiveSessionsLimit, checkSessionExists } = require('../middleware/sessions.middleware');

router.post('/signin', [checkActiveSessionsLimit], controller.signin);
router.put('/signout', [checkSessionExists], controller.signout);

module.exports = router;
