require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Area = require('../models/area');
const User = require('../models/user');
const Session = require('../models/session');
const { createPasswordHash } = require('../services/passwordManager');
const { ensureAdminArea } = require('../migrations/ensureAdminArea');

const PASSWORDS_MONGO_URI = process.env.PASSWORDS_MONGO_URI || 'mongodb://mongo:27017/passwordsDB';

const pad = (n) => String(n).padStart(2, '0');

const SUPER_ADMINS = [
  { userName: 'admin1', name: 'Super Admin Uno' },
  { userName: 'admin2', name: 'Super Admin Dos' },
];

const DEPARTMENTS = [
  {
    areaName: 'Redes',
    description: 'Departamento de Redes (seed de desarrollo)',
    label: 'Redes',
    supervisor: { userName: 'supervisor.redes', name: 'Supervisor Redes' },
    operators: [
      { userName: 'operador.redes1', name: 'Operador Redes 1' },
      { userName: 'operador.redes2', name: 'Operador Redes 2' },
      { userName: 'operador.redes3', name: 'Operador Redes 3' },
    ],
  },
  {
    areaName: 'Gerencia',
    description: 'Departamento de Gerencia (seed de desarrollo)',
    label: 'Gerencia',
    supervisor: { userName: 'supervisor.gerencia', name: 'Supervisor Gerencia' },
    operators: [
      { userName: 'operador.gerencia1', name: 'Operador Gerencia 1' },
      { userName: 'operador.gerencia2', name: 'Operador Gerencia 2' },
      { userName: 'operador.gerencia3', name: 'Operador Gerencia 3' },
    ],
  },
];

// Borra todo: users/sessions/areas de identityDB, y la colección passwords de
// passwordsDB (conexión aparte, passwords-service vive en otra base).
const wipe = async () => {
  await User.deleteMany({});
  await Session.deleteMany({});
  await Area.deleteMany({});

  const passwordsConn = await mongoose.createConnection(PASSWORDS_MONGO_URI).asPromise();
  await passwordsConn.collection('passwords').deleteMany({});
  await passwordsConn.close();

  console.log('Bases de datos limpiadas (users, sessions, areas, passwords).');
};

const createUser = async ({ userName, name, role, area_id, plainPassword }) => {
  const hashedPassword = await createPasswordHash(plainPassword);
  await User.create({ name, userName, password: hashedPassword, role, area_id, avatar: null });
  console.log(`+ ${userName} (${role}) creado — password: ${plainPassword}`);
};

const seed = async () => {
  await wipe();

  const adminArea = await ensureAdminArea();

  for (const [i, sa] of SUPER_ADMINS.entries()) {
    await createUser({
      ...sa,
      role: 'super_admin',
      area_id: adminArea._id,
      plainPassword: `passAdmin${pad(i + 1)}`,
    });
  }

  for (const dept of DEPARTMENTS) {
    const area = await Area.create({ name: dept.areaName, description: dept.description });

    let counter = 1;
    await createUser({
      ...dept.supervisor,
      role: 'supervisor',
      area_id: area._id,
      plainPassword: `pass${dept.label}${pad(counter++)}`,
    });
    for (const op of dept.operators) {
      await createUser({
        ...op,
        role: 'operator',
        area_id: area._id,
        plainPassword: `pass${dept.label}${pad(counter++)}`,
      });
    }
  }

  console.log('\nContraseñas de acceso asignadas por usuario (ver arriba, formato pass<Grupo><NN>).');
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
