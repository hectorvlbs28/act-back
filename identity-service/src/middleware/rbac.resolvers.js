const User = require('../models/user');

// Para GET /users/get/:id y PUT /users/update/:id
const resolveUserByParamId = async (req) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return null;
  return { areaId: user.area_id, resource: user };
};

// Para POST /users/signup — calcula el area_id EFECTIVO igual que lo hará el
// controller (super_admin => null), para que un supervisor no pueda burlar el
// scoping enviando role=super_admin con area_id ajeno.
const resolveSignupBodyAreaId = async (req) => {
  const { role = 'operator', area_id } = req.body;
  return { areaId: role === 'super_admin' ? null : (area_id ?? null) };
};

module.exports = { resolveUserByParamId, resolveSignupBodyAreaId };
