//backend/src/controllers/adminController.js
const AdminService = require('../services/adminService');

class AdminController {
    async getAllUsers(req, res) {
        try {
            const users = await AdminService.getAllUsers();
            res.json({ success: true, data: users });
        } catch (error) {
            console.error('Error en getAllUsers:', error);
            res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
        }
    }

    async getUserBooks(req, res) {
        try {
            const { userId } = req.params;
            const books = await AdminService.getUserBooks(userId);
            res.json({ success: true, data: books });
        } catch (error) {
            console.error('Error en getUserBooks:', error);
            res.status(500).json({ success: false, message: 'Error al obtener libros del usuario' });
        }
    }

    async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const userData = req.body;
            await AdminService.updateUser(userId, userData);
            res.json({ success: true, message: 'Usuario actualizado exitosamente' });
        } catch (error) {
            console.error('Error en updateUser:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
        }
    }

    async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            await AdminService.deleteUser(userId);
            res.json({ success: true, message: 'Usuario eliminado exitosamente' });
        } catch (error) {
            console.error('Error en deleteUser:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
        }
    }

    async toggleAdminStatus(req, res) {
        try {
            const { userId } = req.params;
            await AdminService.toggleAdminStatus(userId);
            res.json({ success: true, message: 'Estado de administrador actualizado' });
        } catch (error) {
            console.error('Error en toggleAdminStatus:', error);
            res.status(500).json({ success: false, message: 'Error al cambiar estado de administrador' });
        }
    }

    async getAllBooks(req, res) {
        try {
            const books = await AdminService.getAllBooks();
            res.json({ success: true, data: books });
        } catch (error) {
            console.error('Error en getAllBooks:', error);
            res.status(500).json({ success: false, message: 'Error al obtener libros' });
        }
    }

    async updateBook(req, res) {
        try {
            const { bookId } = req.params;
            const bookData = req.body;
            await AdminService.updateBook(bookId, bookData);
            res.json({ success: true, message: 'Libro actualizado exitosamente' });
        } catch (error) {
            console.error('Error en updateBook:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar libro' });
        }
    }

    async deleteBook(req, res) {
        try {
            const { bookId } = req.params;
            await AdminService.deleteBook(bookId);
            res.json({ success: true, message: 'Libro eliminado exitosamente' });
        } catch (error) {
            console.error('Error en deleteBook:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar libro' });
        }
    }
}

module.exports = new AdminController();