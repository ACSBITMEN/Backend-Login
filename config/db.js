const { Pool } = require('pg');
require('dotenv').config();

// Configura la conexión a la base de datos utilizando variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,      // Usuario de la base de datos
  host: process.env.DB_HOST,      // Host donde está corriendo la base de datos
  database: process.env.DB_NAME,  // Nombre de la base de datos
  password: process.env.DB_PASSWORD,  // Contraseña del usuario
  port: process.env.DB_PORT,      // Puerto en el que la base de datos está escuchando (por defecto 5432)
});

// Prueba la conexión a la base de datos
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar a la base de datos', err.stack);
  } else {
    console.log('Conectado a la base de datos PostgreSQL');
  }
  release();
});

module.exports = pool;
