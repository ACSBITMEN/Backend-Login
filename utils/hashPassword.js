const bcrypt = require('bcrypt');

// Función para hashear la contraseña
const hashPassword = async (password) => {
  const saltRounds = 10;  // Número de rondas de salt
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error al hashear la contraseña');
  }
};

module.exports = hashPassword;  // Exporta la función para poder usarla en otros archivos
