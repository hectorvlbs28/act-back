const internalErrorMessage =
  "Ha ocurrido un problema inesperado. Si el error persiste, contacta con soporte.";

const userNameRegisteredMessage = (userName) =>
  `El nombre de usuario ${userName} ya está registrado. Intenta con otro o inicia sesión.`;

const signupErrorMessage =
  "Hubo un problema al registrar tu cuenta. Por favor, inténtalo nuevamente.";

const userDoesNotExistMessage = (userName) =>
  `El usuario ${userName} no está asociado a ninguna cuenta. Puedes registrarte para crear una nueva.`;

const passwordErrorMessage =
  "La contraseña ingresada es incorrecta. Por favor, inténtalo de nuevo.";

const sessionsLimitMessage =
  "Se ha alcanzado el límite de sesiones activas. Cierra sesión en otro dispositivo e inténtalo de nuevo.";

const sessionNotFoundMessage =
  "No se encontró una sesión activa. Por favor, inicia sesión nuevamente.";

const signoutErrorMessage =
  "Hubo un problema al cerrar sesión. Por favor, inténtalo nuevamente.";

const createTaskErrorMessage =
  "Hubo un problema al crear la tarea. Por favor, inténtalo nuevamente.";

const createPasswordsErrorMessage =
  "Hubo un problema al registrar la contraseña. Por favor, inténtalo nuevamente.";

const getPasswordErrorMessage =
  "Hubo un problema al consultar la contraseña seleccionada. Por favor, inténtalo nuevamente.";

const deletedPasswordErrorMessage =
  "La contraseña ha sido eliminada anteriormente y no puede ser consultada.";

const passwordNotFound =
  "No se encontraron registros de la contraseña seleccionada.";

const emptyPasswordIdErrorMessage =
  "No se ha seleccionado una contraseña para consultar.";

const missingTokenErrorMessage =
  "No tienes autorización para ejecutar este servicio.";

const tokenExpiredErrorMessage =
  "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión para continuar.";

module.exports = {
  internalErrorMessage,
  userNameRegisteredMessage,
  signupErrorMessage,
  userDoesNotExistMessage,
  passwordErrorMessage,
  sessionsLimitMessage,
  sessionNotFoundMessage,
  signoutErrorMessage,
  createTaskErrorMessage,
  createPasswordsErrorMessage,
  getPasswordErrorMessage,
  deletedPasswordErrorMessage,
  passwordNotFound,
  emptyPasswordIdErrorMessage,
  missingTokenErrorMessage,
  tokenExpiredErrorMessage,
};
