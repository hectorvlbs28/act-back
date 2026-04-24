require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const validateRoute = require('./routes/validate');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'auth-service' }));
app.use('/', authRoutes);
app.use('/validate', validateRoute);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🔐 Auth-service corriendo en el puerto ${PORT}`));
});
