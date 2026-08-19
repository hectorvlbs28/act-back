const User = require('../models/user');
const Area = require('../models/area');

const DEFAULT_AREA_NAME = process.env.DEFAULT_AREA_NAME || 'General';
const BOOTSTRAP_SUPER_ADMIN_USERNAME = process.env.BOOTSTRAP_SUPER_ADMIN_USERNAME;

// Hook de arranque idempotente: garantiza que exista un área por defecto y,
// si se configuró BOOTSTRAP_SUPER_ADMIN_USERNAME, promueve a ese usuario a
// super_admin. Es no-op después de la primera vez que corre.
const ensureUserRolesAndDefaultArea = async () => {
  const usersMissingRole = await User.countDocuments({ role: { $exists: false } });
  if (usersMissingRole === 0) return;

  let defaultArea = await Area.findOne({ name: DEFAULT_AREA_NAME });
  if (!defaultArea) {
    defaultArea = await Area.create({
      name: DEFAULT_AREA_NAME,
      description: 'Área creada automáticamente por identity-service.',
    });
  }

  if (BOOTSTRAP_SUPER_ADMIN_USERNAME) {
    await User.updateOne(
      { userName: BOOTSTRAP_SUPER_ADMIN_USERNAME, role: { $exists: false } },
      { $set: { role: 'super_admin', area_id: null } }
    );
  }

  await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: 'operator', area_id: defaultArea._id } }
  );

  console.log(`Migración: ${usersMissingRole} usuario(s) actualizados con role/area_id por defecto.`);
};

module.exports = { ensureUserRolesAndDefaultArea };
