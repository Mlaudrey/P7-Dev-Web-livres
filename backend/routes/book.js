const express = require('express');
const auth = require('../middleware/auth');  
const multer = require('../middleware/multer-config');  
const router = express.Router();

const { createBook } = require('../controllers/book/createBook');
const { deleteBook } = require('../controllers/book/deleteBook');
const { modifyBook } = require('../controllers/book/modifyBook');
const { getAllBooks } = require('../controllers/book/getAllBooks');
const { getOneBook } = require('../controllers/book/getOneBook');

router.get('/', auth, getAllBooks);
router.post('/', auth, multer, createBook);
router.get('/:id', auth, getOneBook);
router.put('/:id', auth, multer, modifyBook);
router.delete('/:id', auth, deleteBook);

module.exports = router;
