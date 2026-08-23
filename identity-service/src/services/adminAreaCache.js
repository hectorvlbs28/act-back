const { ADMIN_AREA_NAME } = require('../constants/systemArea');

let cachedAdminAreaId = null;

const setAdminAreaId = (id) => {
  cachedAdminAreaId = String(id);
};

// Camino feliz: ya cacheado en boot por ensureAdminArea. Fallback defensivo:
// si algo llama esto antes de que termine el boot hook, resuelve por query y cachea.
const getAdminAreaId = async () => {
  if (cachedAdminAreaId) return cachedAdminAreaId;

  const Area = require('../models/area');
  const area = await Area.findOne({ name: ADMIN_AREA_NAME, system: true });
  if (!area) throw new Error('Área Admin no inicializada.');

  cachedAdminAreaId = String(area._id);
  return cachedAdminAreaId;
};

module.exports = { setAdminAreaId, getAdminAreaId };
