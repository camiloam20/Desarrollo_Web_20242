//backend/src/services/adminService.js
const pool = require('../config/database');

class AdminService {
    async getAllUsers() {
        const [users] = await pool.query(
            'SELECT id, full_name, username, birth_year, is_admin FROM users'
        );
        return users;
    }

    async getUserBooks(userId) {
        const [books] = await pool.query(
            `SELECT b.*, ub.status, ub.favourite, ub.rating, ub.review 
             FROM user_books ub 
             JOIN books b ON ub.book_id = b.id 
             WHERE ub.user_id = ?`,
            [userId]
        );
        return books;
    }

    async updateUser(userId, userData) {
        const { full_name, username, birth_year } = userData;
        await pool.query(
            'UPDATE users SET full_name = ?, username = ?, birth_year = ? WHERE id = ?',
            [full_name, username, birth_year, userId]
        );
    }

    async deleteUser(userId) {
        await pool.query('DELETE FROM user_books WHERE user_id = ?', [userId]);
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    }

    async toggleAdminStatus(userId) {
        await pool.query(
            'UPDATE users SET is_admin = NOT is_admin WHERE id = ?',
            [userId]
        );
    }

    async getAllBooks() {
        const [books] = await pool.query('SELECT * FROM books');
        return books;
    }

    async updateBook(bookId, bookData) {
        const { image, title, author, publisher, pages, genre, description } = bookData;
        await pool.query(
            'UPDATE books SET image = ?, title = ?, author = ?, publisher = ?, pages = ?, genre = ?, description = ? WHERE id = ?',
            [image, title, author, publisher, pages, genre, description, bookId]
        );
    }

    async deleteBook(bookId) {
        await pool.query('DELETE FROM user_books WHERE book_id = ?', [bookId]);
        await pool.query('DELETE FROM books WHERE id = ?', [bookId]);
    }
}

module.exports = new AdminService();