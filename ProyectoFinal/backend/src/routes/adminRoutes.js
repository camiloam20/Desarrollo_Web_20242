//backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Aplicar middleware de autenticación y admin a todas las rutas
router.use(authMiddleware);
router.use(adminMiddleware);

// Rutas de usuarios
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId/books', adminController.getUserBooks);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);
router.put('/users/:userId/toggle-admin', adminController.toggleAdminStatus);

// Rutas de libros
router.get('/books', adminController.getAllBooks);
router.put('/books/:bookId', adminController.updateBook);
router.delete('/books/:bookId', adminController.deleteBook);

module.exports = router;