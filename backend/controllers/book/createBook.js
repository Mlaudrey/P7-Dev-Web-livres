const Book = require('../../models/book');
const { processImage } = require('../../middleware/multer-config');

exports.createBook = async (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book); 
    delete bookObject._id;  // supprime l'ID pour éviter les conflits
    delete bookObject._userId;  // pareil pour userId

    // validation des données
    if (!bookObject.title || !bookObject.author) {
      return res.status(400).json({ error: 'Le titre et l\'auteur sont requis' });
    }

    // traitement de l'image (si envoyée)
    if (req.file) {
      try {
        const newFilename = await processImage(req.file.buffer, req.file.originalname);
        bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${newFilename}`;  // URL de l'image traitée
      } catch (imageError) {
        return res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
      }
    }

    // créer un nouveau livre
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId, 
    });

    await book.save(); // enregistre le livre dans MongoDB
    res.status(201).json({ message: 'Livre créé avec succès !' });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Erreur lors de la création du livre' });
  }
};
