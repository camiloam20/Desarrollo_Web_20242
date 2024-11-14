const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

class AuthController {
  async register(req, res) {
    try {
      const { fullName, username, email, password, birthDate } = req.body;
      
      // Calculate birth year from birthDate
      const birthYear = new Date(birthDate).getFullYear();
      
      // Check if user already exists
      const [existingUsers] = await pool.query(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [email, username]
      );
      
      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El correo electrónico o nombre de usuario ya está registrado'
        });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert new user
      const [result] = await pool.query(
        'INSERT INTO users (full_name, email, password, birth_year, username) VALUES (?, ?, ?, ?, ?)',
        [fullName, email, hashedPassword, birthYear, username]
      );
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: result.insertId, email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        username
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor'
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user with is_admin field
      const [users] = await pool.query(
        'SELECT *, is_admin FROM users WHERE email = ?',
        [email]
      );
      
      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      const user = users[0];
      
      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, isAdmin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        token,
        username: user.username,
        isAdmin: user.is_admin === 1
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor'
      });
    }
  }
}

module.exports = new AuthController();