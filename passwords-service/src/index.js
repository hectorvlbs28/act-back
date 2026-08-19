require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const swaggerSpec = require('./config/swagger');
const passwordsRoutes = require('./routes/passwords');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'passwords-service' }));

app.get('/docs.json', (_req, res) => res.json(swaggerSpec));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', passwordsRoutes);

const PORT = process.env.PORT || 3003;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🔑 Passwords-service corriendo en el puerto ${PORT}`));
});
