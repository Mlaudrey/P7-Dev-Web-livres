const Book = require('../../models/book');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res, next) => {
  try {
    // trouver le livre par ID
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    // vérifier que l'utilisateur est bien le propriétaire du livre
    if (book.userId.toString() !== req.auth.userId) {
      return res.status(403).json({ error: 'Requête non autorisée' });
    }

    // supprimer l'image associée au livre
    const filename = book.imageUrl.split('/images/')[1];
    const imagePath = path.join(__dirname, '../../images', filename);
    console.log('Chemin de l\'image :', imagePath);

    // essayer de supprimer l'image
    try {
      await fs.promises.unlink(imagePath);
      console.log('Image supprimée avec succès.');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn('Image introuvable, suppression ignorée.');
      } else {
        console.error('Erreur lors de la suppression de l\'image :', error.message);
        return res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
      }
    }

    // supprimer le livre de la base de données
    const deleteResult = await Book.deleteOne({ _id: req.params.id });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: 'Livre non trouvé, suppression impossible.' });
    }

    console.log('Livre supprimé avec succès.');
    res.status(200).json({ message: 'Livre supprimé avec succès !' });

  } catch (error) {
    console.error('Erreur lors de la suppression du livre :', error.message);
    res.status(500).json({ error: 'Erreur lors de la suppression du livre' });
  }
};
