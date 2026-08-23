require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const areasRoutes = require('./routes/areas');
const validateRoute = require('./routes/validate');
const { ensureAdminArea } = require('./migrations/ensureAdminArea');
const { ensureUserRolesAndDefaultArea } = require('./migrations/ensureUserRolesAndDefaultArea');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'identity-service' }));

app.get('/docs.json', (_req, res) => res.json(swaggerSpec));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/areas', areasRoutes);
app.use('/validate', validateRoute);

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => ensureAdminArea())
  .then(() => ensureUserRolesAndDefaultArea())
  .then(() => {
    app.listen(PORT, () => console.log(`🪪 Identity-service corriendo en el puerto ${PORT}`));
  });
