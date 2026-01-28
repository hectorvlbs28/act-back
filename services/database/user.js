const { User } = require('../../models');
const { createPasswordHash } = require('../auth/passwordManager');

const createUserService = async (name, userName, password) => {
  try {
    const hashedPassword = await createPasswordHash(password);
    const { name: newUserName } = await User.create({
      name,
      userName,
      password: hashedPassword,
    });

    return {
      newUserName,
    };
  } catch (error) {
    console.log('-- Error in createUserService -> error: ', error.message);
    return error;
  }
};

const isUserRegisteredService = async (userName) => {
  const user = await User.findOne({ where: { userName: userName } });
  return user ? true : false;
};

const getUserByUserNameService = async (userName) => {
  const user = await User.findOne({ where: { userName } });
  const { user_id, name, password } = user;
  return {
    user_id,
    name,
    userName,
    password,
  };
};

module.exports = { createUserService, isUserRegisteredService, getUserByUserNameService };
