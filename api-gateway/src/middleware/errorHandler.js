const errorHandler = (err, req, res, _next) => {
  console.error(`[Gateway Error] ${req.method} ${req.originalUrl} →`, err.message);

  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      message: 'El servicio no está disponible en este momento. Intenta más tarde.',
    });
  }

  if (err.code === 'ETIMEDOUT') {
    return res.status(504).json({
      message: 'El servicio tardó demasiado en responder.',
    });
  }

  res.status(500).json({
    message: 'Error interno en el gateway.',
  });
};

module.exports = errorHandler;
