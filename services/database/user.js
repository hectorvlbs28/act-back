const { User } = require('../../models');
const { createPasswordHash } = require('../auth/passwordManager');

const createUserService = async (name, userName, password) => {
  const hashedPassword = await createPasswordHash(password);
  const user = await User.create({ name, userName, password: hashedPassword });
  return { newUserName: user.name };
};

const isUserRegisteredService = async (userName) => {
  const user = await User.findOne({ userName });
  return !!user;
};

const getUserByUserNameService = async (userName) => {
  const user = await User.findOne({ userName });
  return {
    user_id: user._id,
    name: user.name,
    userName: user.userName,
    password: user.password,
  };
};

module.exports = { createUserService, isUserRegisteredService, getUserByUserNameService };