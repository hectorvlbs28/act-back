require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Area = require('../models/area');
const User = require('../models/user');
const { createPasswordHash } = require('../services/passwordManager');

const SEED_PASSWORD = 'pass123';

const USERS = [
  { userName: 'admin', name: 'Administrador General', role: 'super_admin' },
  { userName: 'supervisor.redes', name: 'Supervisor Redes', role: 'supervisor' },
  { userName: 'operador.redes1', name: 'Operador Redes 1', role: 'operator' },
  { userName: 'operador.redes2', name: 'Operador Redes 2', role: 'operator' },
  { userName: 'operador.redes3', name: 'Operador Redes 3', role: 'operator' },
];

// Idempotente: se puede correr varias veces sin duplicar el área ni los usuarios.
const seed = async () => {
  const area = await Area.findOneAndUpdate(
    { name: 'Redes' },
    { $setOnInsert: { name: 'Redes', description: 'Área de Redes (seed de desarrollo)' } },
    { upsert: true, new: true }
  );
  console.log(`Área "Redes" lista (${area._id}).`);

  const hashedPassword = await createPasswordHash(SEED_PASSWORD);

  for (const u of USERS) {
    const exists = await User.findOne({ userName: u.userName });
    if (exists) {
      console.log(`- ${u.userName} ya existe, se omite.`);
      continue;
    }
    await User.create({
      name: u.name,
      userName: u.userName,
      password: hashedPassword,
      role: u.role,
      area_id: u.role === 'super_admin' ? null : area._id,
    });
    console.log(`+ ${u.userName} (${u.role}) creado.`);
  }

  console.log(`\nContraseña para todas las cuentas seed: ${SEED_PASSWORD}`);
};

const run = async () => {
  await connectDB();
  await seed();
  await mongoose.disconnect();
  process.exit(0);
};

if (require.main === module) {
  run().catch((error) => {
    console.error('Error corriendo el seed:', error.message);
    process.exit(1);
  });
}

module.exports = { seed };
