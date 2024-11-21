const Book = require('../../models/book');

module.exports = async (req, res, next) => {
  try {
    // Récupérer tous les livres de la base de données et trier par averageRating de manière décroissante
    const topBooks = await Book.find().sort({ averageRating: -1 }).limit(3);

    // Retourner les 3 meilleurs livres
    res.status(200).json(topBooks);
  } catch (error) {
    console.error("Error in bestRating:", error);
    res.status(500).json({ message: 'Erreur lors de la récupération des livres', error: error.message });
  }
};
