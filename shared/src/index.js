const HttpStatus = require('./httpStatus');
const { handleError } = require('./handleError');
const asyncHandler = require('./asyncHandler');
const { createAuthMiddleware } = require('./authMiddleware');
const { extractBearerToken } = require('./extractBearerToken');
const { buildSwaggerDefinition } = require('./swaggerDefinition');
const { requireRole, requireSameAreaOrSuperAdmin } = require('./rbac');

module.exports = {
  HttpStatus,
  handleError,
  asyncHandler,
  createAuthMiddleware,
  extractBearerToken,
  buildSwaggerDefinition,
  requireRole,
  requireSameAreaOrSuperAdmin,
};
