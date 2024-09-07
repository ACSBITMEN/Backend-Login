const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// // Ruta '/login' POST para manejar el login
router.post('/login', login);

module.exports = router;
