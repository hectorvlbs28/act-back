const { createAuthMiddleware } = require('@networking/shared');

const validateUserJwt = createAuthMiddleware(process.env.IDENTITY_SERVICE_URL);

module.exports = { validateUserJwt };