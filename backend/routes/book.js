const express = require('express');
const auth = require('../middleware/auth.js');  
const { upload } = require('../middleware/multer-config.js');
  
const router = express.Router();

const { createBook } = require('../controllers/book/createBook.js');
const { deleteBook } = require('../controllers/book/deleteBook');
const { modifyBook } = require('../controllers/book/modifyBook');
const { getAllBooks } = require('../controllers/book/getAllBooks');
const { getOneBook } = require('../controllers/book/getOneBook');
const { getBestrating } = require('../controllers/book/bestrating');
const { rating } = require ('../controllers/book/rating.js');

router.get('/api/books', getAllBooks);
router.post('/api/books', auth, upload, createBook);
router.get('/:id', auth, getOneBook);
router.put('/:id', auth, upload, modifyBook);
router.delete('/:id', auth, deleteBook);
router.get('/:id/bestrating', getBestrating);
router.post('/:id/rating', auth, rating);

module.exports = router;
