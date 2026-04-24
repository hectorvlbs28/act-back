const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/services');

const createProxy = (targetUrl) =>
  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error(`[Proxy Error] → ${targetUrl}:`, err.message);
        res.status(502).json({
          message: 'No se pudo conectar con el servicio de destino.',
        });
      },
      proxyReq: (proxyReq, req) => {
        proxyReq.setHeader('X-Real-IP', req.ip);
        proxyReq.setHeader('X-Forwarded-For', req.ip);
      },
    },
  });

const applyProxyRoutes = (app) => {
  app.use(services.auth.prefix, createProxy(services.auth.url));

  app.use(services.users.prefix, createProxy(services.users.url));

  app.use(services.passwords.prefix, createProxy(services.passwords.url));
};

module.exports = applyProxyRoutes;
