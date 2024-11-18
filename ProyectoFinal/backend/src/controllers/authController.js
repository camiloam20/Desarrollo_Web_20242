const authService = require('../services/authServices');

class AuthController {
  async register(req, res) {
    try {
      const { fullName, username, email, password, birthDate } = req.body;
      
      const birthYear = new Date(birthDate).getFullYear();
      
      // Verificar si el usuario ya existe
      const userExists = await authService.checkExistingUser(email, username);
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'El correo electrónico o nombre de usuario ya está registrado'
        });
      }
      
      // crear nuevo usuario
      const userId = await authService.createUser(fullName, email, password, birthYear, username);
      
      // Generar token JWT
      const token = authService.generateToken(userId, email, false);
      
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
      
      // Encontrar usuario por email
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      // Verificar contraseña
      const validPassword = await authService.validatePassword(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      // Generar token JWT
      const token = authService.generateToken(user.id, user.email, user.is_admin);
      
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