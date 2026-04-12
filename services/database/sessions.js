const { Session } = require('../../models');
const { getUserByUserNameService } = require('./user');

const createSessionService = async (userId, token, expirationTime) => {
  await Session.create({ user_id: userId, token, expiration_time: expirationTime });
};

const getSessionsCountService = async (userName) => {
  const { user_id } = await getUserByUserNameService(userName);
  return Session.countDocuments({ user_id, deleted: false });
};

const sessionExistsService = async (token) => {
  const session = await Session.findOne({ token });
  return !!session;
};

const deleteSessionService = async (token) => {
  await Session.updateOne({ token }, { deleted: true });
};

module.exports = {
  createSessionService,
  getSessionsCountService,
  sessionExistsService,
  deleteSessionService,
};
