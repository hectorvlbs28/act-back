require('dotenv').config();

const services = {
  identity: {
    url: process.env.IDENTITY_SERVICE_URL,
    prefix: '/identity',
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
