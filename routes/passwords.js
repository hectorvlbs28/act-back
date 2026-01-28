var express = require("express");
var router = express.Router();

const controller = require("../controllers/passwords.controller");
const { passwordsPaths } = require("../utils/enums");
const { checkPasswordSatus } = require("../middleware/passwords.middleware");
const { validateUserJwt } = require("../middleware/sessions.middleware");

router.post(
  passwordsPaths.CREATE,
  [validateUserJwt],
  controller.createPasswords
);

router.get(
  passwordsPaths.GET_VALUE_ID,
  [validateUserJwt, checkPasswordSatus],
  controller.getPassword
);

router.get(
  passwordsPaths.GET_ALL,
  [validateUserJwt],
  controller.getPasswordsList
);

router.put(
  passwordsPaths.DELETE_VALUE_ID,
  [validateUserJwt, checkPasswordSatus],
  controller.deletePassword
);

router.put(
  passwordsPaths.UPDATE_VALUE_ID,
  [validateUserJwt, checkPasswordSatus],
  controller.updatePassword
);

module.exports = router;
