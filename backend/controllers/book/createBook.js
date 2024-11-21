const Book = require('../../models/book');
const { processImage } = require('../../middleware/multer-config');

module.exports = async (req, res, next) => {
  try {
    if (!req.body.book) {
      return res.status(400).json({ error: 'Les données du livre sont requises' });
    }

    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    // Validation des données minimales
    if (!bookObject.title || !bookObject.author) {
      return res.status(400).json({ error: 'Le titre et l\'auteur sont requis' });
    }

    // Traitement de l'image (si envoyée)
    if (req.file) {
      try {
        bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${await processImage(req.file.buffer, req.file.originalname)}`;
      } catch (imageError) {
        console.error('Erreur lors du traitement de l\'image:', imageError);
        return res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
      }
    }

    // Création et enregistrement du livre
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
    });

    await book.save();
    return res.status(201).json({
      message: 'Livre créé avec succès !',
      bookId: book._id,
      imageUrl: book.imageUrl,
    });
  } catch (error) {
    console.error('Erreur lors de la création du livre:', error);
    return res.status(500).json({ error: 'Erreur lors de la création du livre' });
  }
};
