// backend/src/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add-to-list', authMiddleware, bookController.addToList);
router.post('/add-review', authMiddleware, bookController.addReview);
router.get('/lists', authMiddleware, bookController.getLists);
router.post('/add-favorites/:bookId', authMiddleware, bookController.addToFavorites);
router.delete('/remove-favorite/:bookId', authMiddleware, bookController.removeFromFavorites);
router.delete('/remove-from-list/:bookId', authMiddleware, bookController.removeFromList);
router.delete('/delete-review/:bookId', authMiddleware, bookController.deleteReview);

module.exports = router;

