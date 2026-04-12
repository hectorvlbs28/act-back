const { Password } = require('../../models');
const { createPasswordCrypto, decryptPasswordCrypto } = require('../auth/passwordManager');

const createPasswordCryptoService = async (pswd_value, pswd_name, pswd_description) => {
  const { ivHex, passwordCrypto } = await createPasswordCrypto(pswd_value);
  const newPassword = await Password.create({
    pswd_value: passwordCrypto,
    pswd_name,
    pswd_description,
    pswd_ivhex: ivHex,
  });
  return newPassword._id;
};

const getPasswordByIdService = async (password_id) => {
  const { pswd_value, pswd_ivhex } = await Password.findOne({
    _id: password_id,
    deleted: false,
  });
  return decryptPasswordCrypto(pswd_value, pswd_ivhex);
};

const getPasswordsListService = async () => {
  return Password.find({ deleted: false })
    .select('_id pswd_name pswd_description')
    .sort({ updatedAt: -1 })
    .lean()
    .then((docs) => docs.map((d) => ({ id: d._id, name: d.pswd_name, description: d.pswd_description })));
};

const isPasswordDeletedService = async (password_id) => {
  const password = await Password.findById(password_id).select('deleted');
  return password ? password.deleted : false;
};

const doesPasswordExistService = async (password_id) => {
  const password = await Password.findById(password_id).select('_id');
  return !!password;
};

const deletePasswordService = async (password_id) => {
  await Password.findByIdAndUpdate(password_id, { deleted: true });
  const { pswd_name } = await Password.findById(password_id).select('pswd_name');
  return { pswd_name };
};

const updatePasswordService = async (password_id, pswd_name, pswd_description, pswd_value) => {
  const { ivHex, passwordCrypto } = await createPasswordCrypto(pswd_value);
  await Password.findByIdAndUpdate(password_id, {
    pswd_name,
    pswd_description,
    pswd_value: passwordCrypto,
    pswd_ivhex: ivHex,
  });
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
