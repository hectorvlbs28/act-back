const swaggerJsdoc = require('swagger-jsdoc');
const { buildSwaggerDefinition } = require('@networking/shared');

const swaggerSpec = swaggerJsdoc({
  definition: buildSwaggerDefinition({
    title: 'API Gateway',
    description: 'Punto de entrada único: proxy hacia identity-service, passwords-service y python-service.',
  }),
  apis: ['./src/index.js'],
});

module.exports = swaggerSpec;
