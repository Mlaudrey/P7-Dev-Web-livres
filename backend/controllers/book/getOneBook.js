const Book = require('../models/book');

// récupérer un livre spécifique
exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    // si le livre n'est pas trouvé
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    // si le livre est trouvé, le renvoyer avec un code 200
    res.status(200).json(book);
  } catch (error) {
    
    res.status(500).json({ error: 'Erreur lors de la récupération du livre', details: error.message });
  }
};
