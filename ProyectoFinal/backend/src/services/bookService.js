//backend/src/services/bookService.js
const pool = require('../config/database');

class BookService {
  async addBookToUserList(userId, bookData, status) {
    try {
      // Primero verificamos si el libro ya existe en la tabla books
      const [existingBooks] = await pool.query(
        'SELECT id FROM books WHERE title = ? AND author = ?',
        [bookData.title, bookData.author]
      );

      let bookId;
      if (existingBooks.length === 0) {
        // Si el libro no existe, lo insertamos
        const [result] = await pool.query(
          'INSERT INTO books (image, title, author, publisher, pages, genre, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            bookData.coverUrl,
            bookData.title,
            bookData.author,
            bookData.publisher || 'No especificado',
            bookData.pages || 0,
            bookData.genre || 'No especificado',
            bookData.description || 'Sin descripción'
          ]
        );
        bookId = result.insertId;
      } else {
        bookId = existingBooks[0].id;
      }

      // Verificamos si el usuario ya tiene este libro en su lista
      const [existingUserBook] = await pool.query(
        'SELECT id FROM user_books WHERE user_id = ? AND book_id = ?',
        [userId, bookId]
      );

      if (existingUserBook.length > 0) {
        // Actualizamos el estado si ya existe
        await pool.query(
          'UPDATE user_books SET status = ? WHERE id = ?',
          [status, existingUserBook[0].id]
        );
        return existingUserBook[0].id;
      } else {
        // Insertamos la nueva relación usuario-libro
        const [result] = await pool.query(
          'INSERT INTO user_books (user_id, book_id, status) VALUES (?, ?, ?)',
          [userId, bookId, status]
        );
        return result.insertId;
      }
    } catch (error) {
      console.error('Error en addBookToUserList:', error);
      throw error;
    }
  }

  async addReview(userId, bookData, rating, review) {
    try {
      const userBookId = await this.addBookToUserList(userId, bookData, 'read');
      
      // Actualizamos la reseña y calificación
      await pool.query(
        'UPDATE user_books SET rating = ?, review = ? WHERE id = ?',
        [rating, review, userBookId]
      );

      return userBookId;
    } catch (error) {
      console.error('Error en addReview:', error);
      throw error;
    }
  }

  async getUserLists(userId) {
    try {
        const [results] = await pool.query(
            `SELECT b.*, ub.status, ub.favourite, ub.rating, ub.review 
             FROM user_books ub 
             JOIN books b ON ub.book_id = b.id 
             WHERE ub.user_id = ?`,
            [userId]
        );

        const lists = {
            favourites: [],
            reading: [],
            'to-read': [],
            read: []
        };

        results.forEach(book => {
            // Add to favorites list if favourites is true
            if (book.favourite) {
                lists.favourites.push(book);
            }
            
            // Add to corresponding reading status list
            if (lists[book.status]) {
                lists[book.status].push(book);
            }
        });

        return lists;
    } catch (error) {
        console.error('Error en getUserLists:', error);
        throw error;
    }
}

async addToFavorites(userId, bookId) {
  try {
      await pool.query(
          'UPDATE user_books SET favourite = true WHERE user_id = ? AND book_id = ?',
          [userId, bookId]
      );
  } catch (error) {
      console.error('Error en addToFavorites:', error);
      throw error;
  }
}

async removeFromFavorites(userId, bookId) {
  try {
      await pool.query(
          'UPDATE user_books SET favourite = false WHERE user_id = ? AND book_id = ?',
          [userId, bookId]
      );
  } catch (error) {
      console.error('Error en removeFromFavorites:', error);
      throw error;
  }
}

async removeFromList(userId, bookId) {
    try {
        await pool.query(
            'DELETE FROM user_books WHERE user_id = ? AND book_id = ?',
            [userId, bookId]
        );
    } catch (error) {
        console.error('Error en removeFromList:', error);
        throw error;
    }
}

async deleteReview(userId, bookId) {
    try {
        await pool.query(
            'UPDATE user_books SET rating = NULL, review = NULL WHERE user_id = ? AND book_id = ?',
            [userId, bookId]
        );
    } catch (error) {
        console.error('Error en deleteReview:', error);
        throw error;
    }
}
}

module.exports = new BookService();