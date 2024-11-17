const express = require('express');
const auth = require('../middleware/auth');  
const multer = require('../middleware/multer-config');  
const router = express.Router();

const bookCtrl = require('../controllers/book');  


router.get('/', auth, bookCtrl.getAllBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/:id', auth, bookCtrl.getOneBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
