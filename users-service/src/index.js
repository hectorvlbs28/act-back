require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const usersRoutes = require('./routes/users');
const internalRoutes = require('./routes/internal');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'users-service' }));
app.use('/', usersRoutes);
app.use('/internal', internalRoutes);

const PORT = process.env.PORT || 3002;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`👤 Users-service corriendo en el puerto ${PORT}`));
});
