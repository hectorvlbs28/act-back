const { handleError } = require("../utils/handleError");
const HttpStatus = require("../utils/httpStatus");

const { logsTypes } = require("../utils/enums");
const {
  createdPasswordSummary,
  deletedPasswordSummary,
  updatePasswordSummary,
} = require("../utils/logsSummaries");
const { createLogService } = require("../services/database/logs");
const {
  createPasswordCryptoService,
  getPasswordByIdService,
  getPasswordsListService,
  deletePasswordService,
  updatePasswordService,
} = require("../services/database/passwords");

const {
  createPasswordsErrorMessage,
  getPasswordErrorMessage,
} = require("../utils/errorMessages");
const {
  createPasswordsSuccessMessage,
  getPasswordSuccessMessage,
  getPasswordsListSuccesMessage,
  deletePasswordSuccesMessage,
  updatePasswordSuccesMessage,
} = require("../utils/succesMessages");

exports.createPasswords = async (req, res) => {
  try {
    const {
      password: pswd_value,
      name: pswd_name,
      description: pswd_description,
    } = req.body;

    const userId = req.userId;

    const password_id = await createPasswordCryptoService(
      pswd_value,
      pswd_name,
      pswd_description
    );
    await createLogService(
      userId,
      logsTypes.CREATE,
      createdPasswordSummary(pswd_name, password_id, userId)
    );

    return res.status(HttpStatus.CREATED).send({
      message: createPasswordsSuccessMessage,
    });
  } catch (error) {
    console.log("-- Error in signup createPasswords -> error: ", error.message);
    return handleError(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      createPasswordsErrorMessage
    );
  }
};

exports.getPassword = async (req, res) => {
  try {
    const { id: password_id } = req.params;
    const pswdDecrypted = await getPasswordByIdService(password_id);

    return res.status(HttpStatus.CREATED).send({
      message: getPasswordSuccessMessage,
      pswdDecrypted,
    });
  } catch (error) {
    console.log("-- Error in signup createPasswords -> error: ", error.message);
    return handleError(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      getPasswordErrorMessage
    );
  }
};

exports.getPasswordsList = async (req, res) => {
  try {
    const passwordsList = await getPasswordsListService();

    return res.status(HttpStatus.CREATED).send({
      message: getPasswordsListSuccesMessage,
      passwordsList,
    });
  } catch (error) {
    console.log(
      "-- Error in signup getPasswordsList -> error: ",
      error.message
    );
    return handleError(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      getPasswordErrorMessage
    );
  }
};

exports.deletePassword = async (req, res) => {
  try {
    const { id: password_id } = req.params;
    const userId = req.userId;

    const { pswd_name } = await deletePasswordService(password_id);

    await createLogService(
      userId,
      logsTypes.DELETE,
      deletedPasswordSummary(pswd_name, password_id, userId)
    );

    return res.status(HttpStatus.CREATED).send({
      message: deletePasswordSuccesMessage,
    });
  } catch (error) {
    console.log("-- Error in signup deletePassword -> error: ", error.message);
    return handleError(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      getPasswordErrorMessage
    );
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id: password_id } = req.params;
    const userId = req.userId;
    const {
      password: pswd_value,
      name: pswd_name,
      description: pswd_description,
    } = req.body;

    await updatePasswordService(
      password_id,
      pswd_name,
      pswd_description,
      pswd_value
    );

    await createLogService(
      userId,
      logsTypes.UPDATE,
      updatePasswordSummary(pswd_name, password_id, userId)
    );

    return res.status(HttpStatus.OK).send({
      message: updatePasswordSuccesMessage,
    });
  } catch (error) {
    console.log("-- Error in signup updatePassword -> error: ", error.message);
    return handleError(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      getPasswordErrorMessage
    );
  }
};
