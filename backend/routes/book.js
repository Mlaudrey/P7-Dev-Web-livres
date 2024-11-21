const express = require('express');
const auth = require('../middleware/auth.js');  
const { upload } = require('../middleware/multer-config.js');
  
const router = express.Router();


router.post('/', auth, upload, require('../controllers/book/createBook.js'));
router.put('/:id', auth, upload, require('../controllers/book/modifyBook'));
router.delete('/:id', auth, require('../controllers/book/deleteBook'));
router.get('/bestrating', require('../controllers/book/bestrating'));
router.get('/:id', require('../controllers/book/getOneBook'));
router.post('/:id/rating', auth, require('../controllers/book/rating.js'));
router.get('/', require('../controllers/book/getAllBooks'));

module.exports = router;
