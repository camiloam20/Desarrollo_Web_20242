//backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida de ejemplo
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Ruta protegida accedida exitosamente' });
});

module.exports = router;