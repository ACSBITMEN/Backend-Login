const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar las rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Crear instancia de Express
const app = express(); // Crea una instancia de una aplicación Express.
const port = 3000; // Define el puerto en el que el servidor escuchará las solicitudes. Aquí se usa el puerto 3000

// Habilitar CORS para todas las rutas
app.use(cors());

// Configura 'body-parser' como middleware para que la aplicación pueda manejar solicitudes con cuerpos en formato JSON
app.use(bodyParser.json()); // Esto permite acceder a los datos enviados en el cuerpo de las solicitudes a través de 'req.body'

// Limitar intentos de logina 100 por cada 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 intentos
  message: 'Demasiados intentos de login desde esta IP, inténtelo de nuevo después de 15 minutos.'
});
app.use('/login', loginLimiter);

// Definir rutas
app.use('/auth', authRoutes);  // Rutas de autenticación
app.use('/user', userRoutes);  // Rutas de usuario

// Ruta '/' GET básica para la raíz del servidor
app.get('/', (req, res) => {
  res.send('¡Hola mundo! Este es una respuesta del servidor');
});

// Inicia el servidor y lo hace escuchar en el puerto definido anteriormente (3000).
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port} - Mensaje por consola.`);
});
