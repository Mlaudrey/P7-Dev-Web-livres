// services/findBookById.js

const Book = require('../models/book');

// fonction pour trouver un livre par son ID
const findBookById = async (id) => {
  const book = await Book.findById(id);
  if (!book) {
    throw new Error('Livre non trouvé');
  }
  return book;
};

module.exports = { findBookById };  
