const { Passwords } = require("../../models");
const {
  createPasswordCrypto,
  decryptPasswordCrypto,
} = require("../auth/passwordManager");

const createPasswordCryptoService = async (
  pswd_value,
  pswd_name,
  pswd_description
) => {
  try {
    const { ivHex, passwordCrypto } = await createPasswordCrypto(pswd_value);
    const newPassword = await Passwords.create({
      pswd_value: passwordCrypto,
      pswd_name,
      pswd_description,
      pswd_ivhex: ivHex,
    });

    return newPassword.password_id;
  } catch (error) {
    console.log("-- Error in createPasswordService -> error: ", error.message);
    return error;
  }
};

const getPasswordByIdService = async (password_id) => {
  try {
    const { pswd_value, pswd_ivhex } = await Passwords.findOne({
      where: {
        password_id,
        deleted: false,
      },
    });
    const pswdDecrypted = await decryptPasswordCrypto(pswd_value, pswd_ivhex);

    return pswdDecrypted;
  } catch (error) {
    console.log(
      "-- Error in getPasswordByIdService -> error: ",
      error.message,
      error
    );
    return error;
  }
};

const getPasswordsListService = async () => {
  const passwordsList = await Passwords.findAll({
    attributes: [
      ["password_id", "id"],
      ["pswd_name", "name"],
      ["pswd_description", "description"],
    ],
    where: { deleted: false },
    order: [["updatedAt", "DESC"]],
  });

  return passwordsList;
};

const isPasswordDeletedService = async (password_id) => {
  try {
    const password = await Passwords.findOne({
      attributes: ["deleted"],
      where: { password_id },
    });

    if (!password) {
      return false;
    }

    return password.deleted;
  } catch (error) {
    console.log(
      "-- Error in isPasswordDeletedService -> error: ",
      error.message
    );
    return false;
  }
};

const doesPasswordExistService = async (password_id) => {
  try {
    const password = await Passwords.findOne({
      attributes: ["password_id"],
      where: { password_id },
    });

    return !!password;
  } catch (error) {
    console.log(
      "-- Error in doesPasswordExistService -> error: ",
      error.message
    );
    return false;
  }
};

const deletePasswordService = async (password_id) => {
  try {
    await Passwords.update(
      {
        deleted: true,
      },
      {
        where: {
          password_id: password_id,
        },
      }
    );

    const { pswd_name } = await Passwords.findOne({
      attributes: ["pswd_name"],
      where: { password_id },
    });

    return { pswd_name };
  } catch (error) {
    console.log("-- Error in deletePasswordService -> error: ", error.message);
    return error;
  }
};

const updatePasswordService = async (
  password_id,
  pswd_name,
  pswd_description,
  pswd_value
) => {
  try {
    const { ivHex, passwordCrypto } = await createPasswordCrypto(pswd_value);
    await Passwords.update(
      {
        pswd_name,
        pswd_description,
        pswd_value: passwordCrypto,
        pswd_ivhex: ivHex,
      },
      {
        where: {
          password_id,
        },
      }
    );
  } catch (error) {
    console.log("-- Error in updatePasswordService -> error: ", error.message);
    return error;
  }
};

module.exports = {
  createPasswordCryptoService,
  getPasswordByIdService,
  getPasswordsListService,
  isPasswordDeletedService,
  doesPasswordExistService,
  deletePasswordService,
  updatePasswordService,
};
