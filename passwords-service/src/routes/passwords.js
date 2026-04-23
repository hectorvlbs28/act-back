const express = require('express');
const router = express.Router();
const controller = require('../controllers/passwords.controller');
const { validateUserJwt } = require('../middleware/auth.middleware');
const { checkPasswordStatus } = require('../middleware/password.middleware');

router.post('/create', [validateUserJwt], controller.create);
router.get('/get/all', [validateUserJwt], controller.getAll);
router.get('/get/value/:id', [validateUserJwt, checkPasswordStatus], controller.getValue);
router.put('/delete/value/:id', [validateUserJwt, checkPasswordStatus], controller.remove);
router.put('/update/value/:id', [validateUserJwt, checkPasswordStatus], controller.update);

module.exports = router;
