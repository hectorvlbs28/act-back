const Password = require('../models/password');

// Hook de arranque idempotente: elimina definitivamente las contraseñas creadas
// antes de que existiera owner_id/visibility (esquema de Fase 2 o anterior), ya
// que no tienen dueño y no hay forma de atribuírselas a nadie. No-op una vez que
// ya no quedan documentos legacy (deleteMany no corre validadores de schema, así
// que el filtro funciona aunque owner_id ya sea required).
const purgeLegacyPasswords = async () => {
  const { deletedCount } = await Password.deleteMany({ owner_id: { $exists: false } });
  if (deletedCount > 0) {
    console.log(`Migración: ${deletedCount} contraseña(s) legacy sin owner_id eliminadas definitivamente.`);
  }
};

module.exports = { purgeLegacyPasswords };
