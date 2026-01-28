var express = require('express');
var router = express.Router();

const controller = require('../controllers/authusers.controller');
const { validateUserRegistered, verifyUserExists } = require('../middleware/user.middleware');
const { checkActiveSessionsLimit, checkSessionExists } = require('../middleware/sessions.middleware');

router.post('/signup', [validateUserRegistered], controller.signup);

router.post('/signin', [verifyUserExists, checkActiveSessionsLimit], controller.signin);

router.put('/signout', [checkSessionExists], controller.signout);

module.exports = router;
