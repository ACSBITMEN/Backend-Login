const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Verificar JWT - Función Middleware para verificar el token JWT en las solicitudes que requieren autenticación.
const verifyToken = (req, res, next) => {
  // Obtiene el token del encabezado 'Authorization' de la solicitud
  const token = req.headers['authorization']?.split(' ')[1];
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


// Función middleware para verificar si el usuario tiene el rol requerido
const verifyRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Realiza una consulta a la base de datos para obtener los roles del usuario
      const result = await pool.query(`
        SELECT r.role_name FROM roles r
        INNER JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
      `, [req.userId]); // Sustituye $1 por el ID del usuario que viene en req.userId

      // Convierte los roles de la base de datos en un array de nombres de roles
      const userRoles = result.rows.map(row => row.role_name);

      // Verifica si el rol requerido está incluido en los roles del usuario
      if (userRoles.includes(requiredRole)) {
        next(); // Si el usuario tiene el rol, continúa con la siguiente función middleware o ruta
      } else {
        // Si no tiene el rol requerido, responde con un código 403 (Acceso denegado)
        res.status(403).send('Acceso denegado. No tienes el rol necesario.');
      }
    } catch (error) {
      // Si hay algún error en la consulta o el proceso, lo registra y responde con un error 500
      console.error('Error al verificar los roles del usuario', error);
      res.status(500).send('Error interno del servidor');
    }
  };
};

// Funciones a exportar
module.exports = {
  verifyToken,
  verifyRole,
};
