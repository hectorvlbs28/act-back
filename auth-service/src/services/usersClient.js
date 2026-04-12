const https = require('http');

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

const getUserCredentials = async (userName) => {
  const response = await fetch(`${USERS_SERVICE_URL}/internal/credentials?userName=${encodeURIComponent(userName)}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`users-service respondió con ${response.status}`);
  }

  return response.json();
};

const getUserSessionsCount = async (userId) => {
  const response = await fetch(`${USERS_SERVICE_URL}/internal/sessions-count?userId=${encodeURIComponent(userId)}`);

  if (!response.ok) {
    throw new Error(`users-service respondió con ${response.status}`);
  }

  const data = await response.json();
  return data.count;
};

module.exports = { getUserCredentials, getUserSessionsCount };
