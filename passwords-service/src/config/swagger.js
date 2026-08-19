const swaggerJsdoc = require('swagger-jsdoc');
const { buildSwaggerDefinition } = require('@networking/shared');

const swaggerSpec = swaggerJsdoc({
  definition: buildSwaggerDefinition({
    title: 'Passwords Service API',
    description: 'Gestión de contraseñas cifradas (Password Manager).',
  }),
  apis: ['./src/routes/*.js'],
});

module.exports = swaggerSpec;
