require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const applyProxyRoutes = require('./routes/proxy');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message: 'Demasiadas peticiones. Intenta en un momento.',
    },
  })
);

app.use(morgan('dev'));
app.use(requestLogger);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Estado del gateway
 *     tags: [Gateway]
 *     responses:
 *       200:
 *         description: El gateway está corriendo
 */
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

app.get('/docs.json', (_req, res) => res.json(swaggerSpec));

// Agregador: cada servicio expone su propia doc en /docs.json, accesible acá
// mismo a través del proxy — no se duplican anotaciones @swagger de rutas ajenas.
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(null, {
    explorer: true,
    swaggerOptions: {
      urls: [
        { url: '/docs.json', name: 'API Gateway' },
        { url: '/identity/docs.json', name: 'Identity Service' },
        { url: '/passwords/docs.json', name: 'Passwords Service' },
        { url: '/python/openapi.json', name: 'Python Service' },
      ],
    },
  })
);

applyProxyRoutes(app);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway corriendo en el puerto ${PORT}`);
  console.log(`   Identity  → ${process.env.IDENTITY_SERVICE_URL}`);
  console.log(`   Passwords → ${process.env.PASSWORDS_SERVICE_URL}`);
  console.log(`   Python    → ${process.env.PYTHON_SERVICE_URL}`);
});
