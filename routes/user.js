const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');  // Importa las funciones del controlador
const { verifyToken, verifyRole } = require('../middlewares/auth');

// Aplicar `verifyToken` a las rutas CRUD para que solo los usuarios autenticados puedan acceder a ellas

router.get('/', verifyToken, verifyRole('admin'), getAllUsers);             // Obtener todos los usuarios, protegido
router.get('/:id', verifyToken, verifyRole('admin'), getUserById);          // Obtener un usuario por ID, protegido
router.post('/', verifyToken, verifyRole('admin'), createUser);             // Crear un nuevo usuario, protegido
router.put('/:id', verifyToken, verifyRole('admin'), updateUser);           // Actualizar un usuario por ID, protegido
router.delete('/:id', verifyToken, verifyRole('admin'), deleteUser);        // Eliminar un usuario por ID, protegido

module.exports = router;
