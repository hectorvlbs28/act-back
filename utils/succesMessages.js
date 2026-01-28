const signupSuccessMessage = (name) =>
  `¡Bienvenido, ${name}! Tu cuenta ha sido creada con éxito. ¡Disfruta la experiencia!`;

const signInSuccesMessage = (userRealName) =>
  ` Inicio de sesión exitoso. ¡Bienvenido, ${userRealName}!`;

const signoutSuccessMessage = "Sesión cerrada correctamente. ¡Hasta pronto!";

const createTaskSuccessMessage = (title) =>
  `Tarea: ${title}, creada con éxito.`;

const createPasswordsSuccessMessage = "Contraseña creada correctamente.";

const getPasswordSuccessMessage = "Contraseña obtenida con exito.";

const getPasswordsListSuccesMessage = "Contraseñas obtenida con exito.";

const deletePasswordSuccesMessage =
  "Se ha eliminado la contraseña correctamente.";

const updatePasswordSuccesMessage =
  "Se ha actualizado la contraseña correctamente.";

module.exports = {
  signupSuccessMessage,
  signInSuccesMessage,
  signoutSuccessMessage,
  createTaskSuccessMessage,
  createPasswordsSuccessMessage,
  getPasswordSuccessMessage,
  getPasswordsListSuccesMessage,
  deletePasswordSuccesMessage,
  updatePasswordSuccesMessage,
};
