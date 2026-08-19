const swaggerJsdoc = require('swagger-jsdoc');
const { buildSwaggerDefinition } = require('@networking/shared');

const swaggerSpec = swaggerJsdoc({
  definition: buildSwaggerDefinition({
    title: 'Identity Service API',
    description: 'Autenticación, usuarios, áreas y sesiones — dueño de los dominios User, Area y Session.',
  }),
  apis: ['./src/routes/*.js'],
});

module.exports = swaggerSpec;
