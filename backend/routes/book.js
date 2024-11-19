const express = require('express');
const auth = require('../middleware/auth');  
const { upload } = require('../middleware/multer-config');
const uploadRoutes = require('./routes/upload');
  
const router = express.Router();
app.use('/api', uploadRoutes);

const { createBook } = require('../controllers/book/createBook');
const { deleteBook } = require('../controllers/book/deleteBook');
const { modifyBook } = require('../controllers/book/modifyBook');
const { getAllBooks } = require('../controllers/book/getAllBooks');
const { getOneBook } = require('../controllers/book/getOneBook');
const { getBestrating } = require('../controllers/book/bestrating');
const { rating } = require ('../controllers/book/rating.js');

router.get('/', auth, getAllBooks);
router.post('/', auth, upload, createBook);
router.get('/:id', auth, getOneBook);
router.put('/:id', auth, upload, modifyBook);
router.delete('/:id', auth, deleteBook);
router.get('/:id/bestrating', getBestrating);
router.post('/:id/rating', auth, rating);

module.exports = router;
