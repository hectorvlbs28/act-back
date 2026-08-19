const buildSwaggerDefinition = ({ title, version = '1.0.0', description }) => ({
  openapi: '3.0.0',
  info: { title, version, description },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
});

module.exports = { buildSwaggerDefinition };
