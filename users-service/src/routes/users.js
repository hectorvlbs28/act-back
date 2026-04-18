const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const { validateUserRegistered } = require('../middleware/user.middleware');

router.post('/signup', [validateUserRegistered], controller.signup);

module.exports = router;
