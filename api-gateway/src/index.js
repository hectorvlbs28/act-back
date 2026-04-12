require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const applyProxyRoutes = require('./routes/proxy');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// --- Middlewares de seguridad globales ---
app.use(helmet());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting global: 100 req/min por IP
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

// express.json NO va aquí — el proxy necesita el body sin parsear
// Los microservicios individuales lo parsean ellos mismos

// --- Health check del gateway ---
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

// --- Rutas proxy hacia los microservicios ---
applyProxyRoutes(app);

// --- Manejo de rutas no encontradas y errores ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway corriendo en el puerto ${PORT}`);
  console.log(`   Auth    → ${process.env.AUTH_SERVICE_URL}`);
  console.log(`   Passwords → ${process.env.PASSWORDS_SERVICE_URL}`);
  console.log(`   Logs    → ${process.env.LOGS_SERVICE_URL}`);
});
