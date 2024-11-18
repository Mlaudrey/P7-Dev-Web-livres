const Book = require('../../models/book');

// fonction pour mettre à jour la note moyenne d'un livre
exports.updateAverageRating = async (bookId) => {
  try {
    const book = await Book.findById(bookId);
    
    // vérifie si le livre existe
    if (!book) {
      throw new Error("Livre introuvable");
    }

    // la méthode calculateAverageRating() est appelée ici automatiquement avant l'enregistrement du livre,
    // donc il n'est pas nécessaire de recalculer la moyenne manuellement
    await book.save();  // le middleware pre-save se chargera du calcul de la moyenne

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la note moyenne :", error.message);
    throw new Error("Erreur lors de la mise à jour de la note moyenne");
  }
};

// fonction pour obtenir la note moyenne d'un livre spécifique
exports.getAverageRating = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);

    // vérifier si le livre existe
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // renvoie la note moyenne
    return res.status(200).json({ averageRating: book.averageRating });

  } catch (error) {
    console.error("Erreur lors de la récupération de la note moyenne :", error.message);
    return res.status(500).json({ error: "Erreur interne lors de la récupération de la note moyenne" });
  }
};
