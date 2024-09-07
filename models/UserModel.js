const pool = require('../config/db');  // Reutiliza la conexión a la base de datos

class UserModel {
  // Obtener todos los usuarios, junto con sus roles
  static async getAllUsers() {
    const result = await pool.query(`
      SELECT users.id, username, first_name, last_name, email, role_name
      FROM users
      LEFT JOIN user_roles ON users.id = user_roles.user_id
      LEFT JOIN roles ON roles.id = user_roles.role_id
    `);
    return result.rows;
  }

  // Obtener un solo usuario por ID, junto con su rol
  static async getUserById(id) {
    const result = await pool.query(`
      SELECT users.id, username, first_name, last_name, email, role_name
      FROM users
      LEFT JOIN user_roles ON users.id = user_roles.user_id
      LEFT JOIN roles ON roles.id = user_roles.role_id
      WHERE users.id = $1
    `, [id]);
    return result.rows[0];
  }

  // Crear un nuevo usuario
  static async createUser(username, first_name, last_name, password_hash, email, role_id) {
    const client = await pool.connect();  // Inicia la transacción
    try {
      await client.query('BEGIN');
      // Inserta en la tabla users
      const userResult = await client.query(
        `INSERT INTO users (username, first_name, last_name, password_hash, email) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [username, first_name, last_name, password_hash, email]
      );
      const user = userResult.rows[0];

      // Inserta en la tabla user_roles
      await client.query(
        `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`,
        [user.id, role_id]
      );
      
      await client.query('COMMIT');
      return user;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Actualizar un usuario por ID
  static async updateUser(id, username, first_name, last_name, email, role_id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Actualiza la tabla de usuarios
      const result = await client.query(`
        UPDATE users 
        SET username = $1, first_name = $2, last_name = $3, email = $4, updated_at = now() 
        WHERE id = $5 RETURNING *`,
        [username, first_name, last_name, email, id]
      );
      const user = result.rows[0];

      // Actualiza el rol del usuario
      await client.query(`
        UPDATE user_roles SET role_id = $1 WHERE user_id = $2`,
        [role_id, id]
      );

      await client.query('COMMIT');
      return user;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Eliminar un usuario por ID (esto también eliminará el rol gracias a ON DELETE CASCADE)
  static async deleteUser(id) {
    const result = await pool.query(`
      DELETE FROM users WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = UserModel;
