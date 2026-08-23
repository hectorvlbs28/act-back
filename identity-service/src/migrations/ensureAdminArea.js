const Area = require('../models/area');
const User = require('../models/user');
const { ADMIN_AREA_NAME } = require('../constants/systemArea');
const { setAdminAreaId } = require('../services/adminAreaCache');

// Hook de arranque idempotente: garantiza que exista el área Admin (reservada
// para super_admin, nunca desactivable) y cachea su id. También hace backfill
// de super_admin legacy con area_id null (de antes de que esta área existiera).
const ensureAdminArea = async () => {
  let adminArea = await Area.findOne({ name: ADMIN_AREA_NAME });
  if (!adminArea) {
    adminArea = await Area.create({
      name: ADMIN_AREA_NAME,
      description: 'Área reservada para super_admin. No puede desactivarse.',
      system: true,
    });
  } else if (!adminArea.system) {
    adminArea.system = true;
    await adminArea.save();
  }

  setAdminAreaId(adminArea._id);

  const { modifiedCount } = await User.updateMany(
    { role: 'super_admin', area_id: null },
    { $set: { area_id: adminArea._id } }
  );
  if (modifiedCount > 0) {
    console.log(`Migración: ${modifiedCount} super_admin(s) legacy asignados al área Admin.`);
  }

  return adminArea;
};

module.exports = { ensureAdminArea };
