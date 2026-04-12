require('dotenv').config();

const services = {
  auth: {
    url: process.env.AUTH_SERVICE_URL,
    prefix: '/auth',
  },
  passwords: {
    url: process.env.PASSWORDS_SERVICE_URL,
    prefix: '/passwords',
  },
  logs: {
    url: process.env.LOGS_SERVICE_URL,
    prefix: '/logs',
  },
};

module.exports = services;
