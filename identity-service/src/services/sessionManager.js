const Session = require('../models/session');

// Invalida (soft-delete) TODAS las sesiones activas de un usuario, sin importar
// el dispositivo/token que originó el cambio. Se llama tras cualquier cambio
// administrativo sensible (role, area_id, o baja) para forzar re-login.
const invalidateUserSessions = async (userId) => {
  const { modifiedCount } = await Session.updateMany(
    { user_id: String(userId), deleted: false },
    { $set: { deleted: true } }
  );
  return modifiedCount;
};

module.exports = { invalidateUserSessions };
