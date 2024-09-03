const bcrypt = require('bcrypt');

const password = 'user'; // Reemplaza esto con la contraseña que quieras hashear
const saltRounds = 10; // Número de rondas de salt (más alto es más seguro pero más lento)

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error hasheando la contraseña:', err);
  } else {
    console.log('Contraseña hasheada:', hash);
  }
});
