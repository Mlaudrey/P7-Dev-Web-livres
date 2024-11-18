const Book = require('../../models/book');
const fs = require('fs');
const path = require('path');

exports.deleteBook = async (req, res) => {
  try {
    // trouver le livre par ID
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    // vérifier que l'utilisateur est bien le propriétaire du livre
    if (book.userId.toString() !== req.auth.userId) {  // utilisation de toString() pour comparer les ObjectId
      return res.status(403).json({ error: 'Requête non autorisée' });  
    }

    // supprimer l'image associée au livre
    const filename = book.imageUrl.split('/images/')[1];
    const imagePath = path.join(__dirname, '../images', filename);

    // supprimer l'image et ensuite supprimer le livre de la base de données
    try {
      await fs.promises.unlink(imagePath);  // suppression de l'image
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image :', error.message);
      // vous pouvez décider de continuer à supprimer le livre même si l'image est introuvable ou renvoyer une erreur selon le cas
      return res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
    }

    // supprimer le livre de la base de données
    await Book.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Livre supprimé avec succès !' });

  } catch (error) {
    console.error('Erreur lors de la suppression du livre :', error.message);
    res.status(500).json({ error: 'Erreur lors de la suppression du livre' });
  }
};
