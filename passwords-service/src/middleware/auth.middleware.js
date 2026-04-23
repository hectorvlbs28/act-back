const { createAuthMiddleware } = require('@networking/shared');

const validateUserJwt = createAuthMiddleware(process.env.AUTH_SERVICE_URL);

module.exports = { validateUserJwt };