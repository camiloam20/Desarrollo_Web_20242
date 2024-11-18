//backend/src/controllers/bookController.js
const BookService = require('../services/bookService');

class BookController {
  async addToList(req, res) {
    try {
      const { bookData, status } = req.body;
      const userId = req.user.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado correctamente'
        });
      }

      const result = await BookService.addBookToUserList(userId, bookData, status);
      
      res.json({
        success: true,
        message: 'Libro añadido exitosamente a la lista',
        userBookId: result
      });
    } catch (error) {
      console.error('Error al añadir libro a la lista:', error);
      res.status(500).json({
        success: false,
        message: 'Error al añadir el libro a la lista'
      });
    }
  }

  async addReview(req, res) {
    try {
      const { bookData, rating, review } = req.body;
      const userId = req.user.id;

      const result = await BookService.addReview(userId, bookData, rating, review);
      
      res.json({
        success: true,
        message: 'Reseña añadida exitosamente',
        userBookId: result
      });
    } catch (error) {
      console.error('Error al añadir reseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error al añadir la reseña'
      });
    }
  }

  async getBookStatus(req, res) {
    try {
      const userId = req.user.id;
      const { bookId } = req.params;

      const status = await BookService.getBookStatus(userId, bookId);
      
      res.json(status);
    } catch (error) {
      console.error('Error al obtener estado del libro:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el estado del libro'
      });
    }
  }
}

module.exports = new BookController();