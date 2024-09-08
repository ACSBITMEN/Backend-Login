const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Consulta al usuario en la base de datos por su username
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password_hash); // Busca un usuario que coincida con el 'username' y 'password' proporcionados
      if (isMatch) { // si coincide...
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        /*
          + Crea un token JWT que incluye el 'id' del usuario;
          + 'secret_key' es una cadena secreta utilizada para firmar el token; (En producción, esta clave debe ser segura y no estar expuesta en el código fuente.)
          + 'expiresIn' define el tiempo de expiración del token. Aquí, el token expirará en 4 horas.
        */
        res.json({ token }); // (salida) Envía el token al cliente en formato JSON
      } else {  // pero si no son correctas o ...
        res.status(401).send('Credenciales incorrectas'); // Envía una respuesta de error 401 (No autorizado) con un mensaje 'Credenciales incorrectas'.
      }
    } else { // Si no son correctas
      res.status(401).send('Credenciales incorrectas'); // Envía una respuesta de error 401 (No autorizado) con un mensaje 'Credenciales incorrectas'.
    }
  } catch (error) {
    console.error('Error en la consulta de login', error);
    res.status(500).send('Error interno del servidor');
  }
};

module.exports = {
  login,
};
