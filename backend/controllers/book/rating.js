const Book = require('../../models/book'); 

// fonction pour attribuer une note à un livre
module.exports = async (req, res) => {
  try {
    const { userId, rating } = req.body; 

    // vérifie si la note est valide (comprise entre 0 et 5)
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5.' });
    }

    console.log(req.params.id);
    // trouve le livre par son ID
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé.' });
    }

    // vérifie si l'utilisateur a déjà noté ce livre
    if (book.ratings && book.ratings.includes(userId)) {
      return res.status(400).json({ error: 'Vous avez déjà noté ce livre.' });
    }

    book.ratings.push({ userId, grade: rating });

    // calcule la nouvelle note moyenne
    const totalRatings = book.ratings.reduce((acc, curr) => {
      return acc + (curr.grade || 0); 
    }, 0);
    const averageRating = book.ratings.length ? totalRatings / book.ratings.length : 0;
    
    //note moyenne  1 chiffre après la virgule
    book.averageRating = parseFloat(averageRating.toFixed(1));

    // sauvegarde les modifications dans la base de données
    await book.save();
    
    // retourne la réponse avec le livre mis à jour
    res.status(200).json(book);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note:', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
};