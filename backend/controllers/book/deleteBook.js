const Book = require('../../models/book');
const fs = require('fs');
const path = require('path');

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    // vérification que l'utilisateur est le propriétaire du livre
    if (book.userId !== req.auth.userId) {
      return res.status(401).json({ error: 'Non-autorisé' });
    }

    // suppression de l'image du serveur
    const filename = book.imageUrl.split('/images/')[1];
    try {
      await fs.promises.unlink(path.join(__dirname, '../images', filename));  
      await Book.deleteOne({ _id: req.params.id });  // suppression du livre
      res.status(200).json({ message: 'Livre supprimé avec succès !' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'image ou du livre' });
    }
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Erreur lors de la suppression du livre' });
  }
};
