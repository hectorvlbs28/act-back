const { Sessions } = require('../../models');
const { getUserByUserNameService } = require('./user');

const createSessionService = async (userId, token, expirationTime) => {
  try {
    await Sessions.create({
      user_id: userId,
      token,
      expiration_time: expirationTime,
    });
  } catch (error) {
    console.log('-- Error in createSessionService -> error: ', error.message);
    return error;
  }
};

const getSessionsCountService = async (userName) => {
  const { user_id: userId } = await getUserByUserNameService(userName);
  const sessionsCount = await Sessions.count({ where: { user_id: userId, deleted: false } });
  return sessionsCount;
};

const sessionExistsService = async (token) => {
  const session = await Sessions.findOne({ where: { token } });
  return session ? true : false;
};

const deleteSessionService = async (token) => {
  await Sessions.update({ deleted: true }, { where: { token } });
};

module.exports = {
  createSessionService,
  getSessionsCountService,
  sessionExistsService,
  deleteSessionService,
};
