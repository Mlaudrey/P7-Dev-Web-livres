const Book = require('../../models/book');
const { getOneBook } = require('./getOneBook');

// modifier un livre
module.exports = async (req, res, next) => {
  try {
    // créer l'objet bookObject en prenant en compte l'image si elle est fournie
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
      : { ...req.body };

    // supprimer _userId de l'objet pour éviter les conflits
    delete bookObject._userId;

    // Chercher le livre à modifier
    const book = await getOneBook(req.params.id);

    // vérifie si l'utilisateur qui tente de modifier le livre est bien le propriétaire
    if (book.userId.toString() !== req.auth.userId) {  // utilisation de toString() pour comparer les ObjectId
      return res.status(403).json({ message: 'Requête non autorisée' });
    }

    // mettre à jour le livre dans la base de données
    await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });

    res.status(200).json({ message: 'Livre modifié avec succès !' });
  } catch (error) {
    if (error.message === 'Livre non trouvé') {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(500).json({ error: 'Erreur lors de la modification du livre', details: error.message });
  }
};
