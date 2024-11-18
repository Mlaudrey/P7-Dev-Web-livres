const Book = require('../../models/book');

// fonction pour chercher un livre par son ID
exports.findBookById = async (id) => {
  try {
    const book = await Book.findOne({ _id: id });
    
    if (!book) {
      throw new Error('Livre non trouvé');
    }

    return book; // renvoie le livre trouvé
  } catch (error) {
    throw new Error(`Erreur lors de la recherche du livre : ${error.message}`);
  }
};
