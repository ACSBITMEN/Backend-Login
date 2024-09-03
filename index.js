const express = require('express');// Importa el módulo 'express', que es un framework para construir aplicaciones web en Node.js
const bodyParser = require('body-parser'); // Importa el módulo 'body-parser', que ayuda a procesar los datos enviados en las solicitudes HTTP
const jwt = require('jsonwebtoken'); // Importa el módulo 'jsonwebtoken', que se utiliza para crear y verificar JSON Web Tokens (JWT)
const bcrypt = require('bcrypt'); 
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg'); // Importa el módulo 'pg' para interactuar con PostgreSQL
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env


const app = express(); // Crea una instancia de una aplicación Express
const port = 3000; // Define el puerto en el que el servidor escuchará las solicitudes. Aquí se usa el puerto 3000

// Configura 'body-parser' como middleware para que la aplicación pueda manejar solicitudes con cuerpos en formato JSON
app.use(bodyParser.json()); // Esto permite acceder a los datos enviados en el cuerpo de las solicitudes a través de 'req.body'

// Limita los intentos de login a 10 por cada 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 intentos por IP cada 15 minutos ( varios intento para desarollo)
  message: 'Demasiados intentos de login desde esta IP, por favor inténtelo de nuevo después de 15 minutos.'
});

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
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Conectado a la base de datos PostgreSQL');
  }
  release();
});

/*
  A continuación, se crean varias rutas HTTP (GET y POST) que manejarán diferentes endpoints de la aplicación.
  En el futuro, se podrían agregar más rutas para manejar otros métodos HTTP como PUT, DELETE, etc.
*/

// Ruta '/' GET básica para la raíz del servidor
app.get('/', (req, res) => { 
  // 'req' es el objeto de solicitud (entrada) que contiene información sobre la solicitud HTTP
  // 'res' es el objeto de respuesta (salida) que se utiliza para enviar una respuesta al cliente
  res.send('¡Hola mundo! Este es una respuesta del servidor para el navegador'); // Responde una respuesta simple de texto al cliente
});

// Ruta '/login' POST para manejar el login
app.post('/login', loginLimiter, async (req, res) => { // (entrada) Extrae 'username' y 'password' del cuerpo 'JSON' de la solicitud
  const { username, password } = req.body;

  try {
    // Consulta al usuario en la base de datos por su username
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

  if (user) { // Si se encuentra un usuario que coincide
    const isMatch = await bcrypt.compare(password, user.password_hash); // Busca un usuario que coincida con el 'username' y 'password' proporcionados
    if (isMatch) { // si coincide...
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '4h' });
        /*
          + Crea un token JWT que incluye el 'id' del usuario;
          + 'secret_key' es una cadena secreta utilizada para firmar el token; (En producción, esta clave debe ser segura y no estar expuesta en el código fuente.)
          + 'expiresIn' define el tiempo de expiración del token. Aquí, el token expirará en 4 horas.
        */
        res.json({ token });// (salida) Envía el token al cliente en formato JSON
      } else {  // pero si no son correctas o ...
        res.status(401).send('Credenciales incorrectas'); // Envía una respuesta de error 401 (No autorizado) con un mensaje 'Credenciales incorrectas'.
      }
    } else {  // Si no son correctas
      res.status(401).send('Credenciales incorrectas'); // Envía una respuesta de error 401 (No autorizado) con un mensaje 'Credenciales incorrectas'.
    }
  } catch (error) {
    console.error('Error en la consulta de login', error);
    res.status(500).send('Error interno del servidor');
  }
});


/*
  Este middleware se ejecuta antes de que la ruta protegida maneje la solicitud.
*/

// Middleware para verificar el token JWT en las solicitudes que requieren autenticación.
const verifyToken = (req, res, next) => {
  // Obtiene el token del encabezado 'Authorization' de la solicitud
  const token = req.headers['authorization'];  // Es común enviar el token en el formato: 'Authorization: Bearer <token>'
  
  // Si no se proporciona un token...
  if (!token) {
    return res.status(403).send('Se requiere un token'); // Responde con un error 403 (Prohibido)
  }

  // Verifica la validez del token utilizando la misma 'secret_key' que se usó para firmarlo
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      // Si el token no es válido o ha expirado... 
      return res.status(401).send('Token no válido'); // Responde con un error 401 (No autorizado)
    }

    req.userId = decoded.id; // Si el token es válido, almacena el 'id' del usuario decodificado en 'req.userId' para su uso posterior
    next();// Llama a 'next()' para pasar el control a la siguiente función de middleware o a la ruta protegida
  });
};

// Ruta GET protegida que solo puede ser accedida por usuarios autenticados
app.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.userId]);
    const user = result.rows[0];

    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        created_at: user.created_at
      });
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error al consultar el perfil', error);
    res.status(500).send('Error interno del servidor');
  }
});

/*
  Inicia el servidor y lo hace escuchar en el puerto definido anteriormente (3000).
  Una vez que el servidor esté en funcionamiento, mostrará un mensaje en la consola.
*/

// Inicia el servidor y lo hace escuchar en el puerto definido anteriormente (3000).
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}. - Mensaje por consola.`);
});
