const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');

router.get('/', auth, bookCtrl.getAllThings);
router.post('/', auth, multer, bookCtrl.createThing);
router.get('/:id', auth, bookCtrl.getOneThing);
router.put('/:id', auth, multer, bookCtrl.modifyThing);
router.delete('/:id', auth, bookCtrl.deleteThing);


module.exports = router;