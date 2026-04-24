require('dotenv').config();

const services = {
  auth: {
    url: process.env.AUTH_SERVICE_URL,
    prefix: '/auth',
  },
  users: {
    url: process.env.USERS_SERVICE_URL,
    prefix: '/users',
  },
  passwords: {
    url: process.env.PASSWORDS_SERVICE_URL,
    prefix: '/passwords',
  },
  python: {
    url: process.env.PYTHON_SERVICE_URL,
    prefix: '/python',
  },
};

module.exports = services;
