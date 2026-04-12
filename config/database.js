require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

const connectDB = async () => {
  try {
    await mongoose.connect(`${MONGODB_URI}/${MONGODB_DATABASE}`);
    console.log('✅ MongoDB conectado correctamente.');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose };