// backend/src/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add-to-list', authMiddleware, bookController.addToList);
router.post('/add-review', authMiddleware, bookController.addReview);
router.get('/status/:bookId', authMiddleware, bookController.getBookStatus);

module.exports = router;