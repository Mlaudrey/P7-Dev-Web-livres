const express = require('express');
const auth = require('../middleware/auth');  
const { upload } = require('../middleware/multer-config');
  
const router = express.Router();

const { createBook } = require('../controllers/book/createBook');
const { deleteBook } = require('../controllers/book/deleteBook');
const { modifyBook } = require('../controllers/book/modifyBook');
const { getAllBooks } = require('../controllers/book/getAllBooks');
const { getOneBook } = require('../controllers/book/getOneBook');
const { getAverageRating } = require('../controllers/book/averageRating');

router.get('/', auth, getAllBooks);
router.post('/', auth, upload, createBook);
router.get('/:id', auth, getOneBook);
router.put('/:id', auth, upload, modifyBook);
router.delete('/:id', auth, deleteBook);
router.get('/:id/averageRating', getAverageRating);

module.exports = router;
