const createdPasswordSummary = (pswd_name, password_id, userId) =>
  `Usuario con ID ${userId} ha creado la contraseña "${pswd_name}", vinculada al identificador ${password_id}.
`;

const deletedPasswordSummary = (pswd_name, password_id, userId) =>
  `Usuario con ID ${userId} ha eliminado la contraseña "${pswd_name}", vinculada al identificador ${password_id}.
`;

const updatePasswordSummary = (pswd_name, password_id, userId) =>
  `Usuario con ID ${userId} ha actualizado la contraseña "${pswd_name}", vinculada al identificador ${password_id}.
`;

module.exports = {
  createdPasswordSummary,
  deletedPasswordSummary,
  updatePasswordSummary,
};
