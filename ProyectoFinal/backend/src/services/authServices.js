//backend/src/routes/authServices.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

class AuthService {
  async checkExistingUser(email, username) {
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    return existingUsers.length > 0;
  }

  async createUser(fullName, email, password, birthYear, username) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password, birth_year, username) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, hashedPassword, birthYear, username]
    );
    return result.insertId;
  }

  async findUserByEmail(email) {
    const [users] = await pool.query(
      'SELECT *, is_admin FROM users WHERE email = ?',
      [email]
    );
    return users[0];
  }

  async validatePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId, email, isAdmin) {
    return jwt.sign(
      { id: userId, email, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

module.exports = new AuthService();