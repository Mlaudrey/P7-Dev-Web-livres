const Book = require('../../models/book'); // Importer le modèle Book
const fs = require('fs'); // Pour manipuler le système de fichiers (si une nouvelle image est téléchargée)
const path = require('path');
const { processImage } = require('../../middleware/multer-config'); // Importer la fonction processImage

module.exports = async (req, res, next) => {
  try {
    // Trouver le livre par ID
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    // Vérifier si l'utilisateur qui tente de modifier est le propriétaire du livre
    if (book.userId.toString() !== req.auth.userId) {
      return res.status(403).json({ message: 'Requête non autorisée' });
    }

    let updatedBookData = req.body;

    // Si un fichier a été téléchargé, traiter l'image
    if (req.file) {
      console.log('Fichier téléchargé :', req.file.originalname);

      // Traitement de l'image (redimensionnement et conversion en WebP)
      const processedFilename = await processImage(req.file.buffer, req.file.originalname);

      // Construction de l'URL publique de l'image
      const imageUrl = `${req.protocol}://${req.get('host')}/images/${processedFilename}`;

      // Mise à jour des données du livre avec la nouvelle image
      updatedBookData.imageUrl = imageUrl;

      // Suppression de l'ancienne image, si elle existe
      const oldImageFilename = book.imageUrl.split('/images/')[1];
      if (oldImageFilename) {
        const oldImagePath = path.join(__dirname, '../images', oldImageFilename);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Erreur lors de la suppression de l\'ancienne image :', err);
          } else {
            console.log('Ancienne image supprimée :', oldImageFilename);
          }
        });
      }
    } else {
      // Si aucune nouvelle image n'est fournie, conserver l'ancienne URL d'image
      updatedBookData.imageUrl = book.imageUrl;
    }

    // Mise à jour du livre dans la base de données
    await Book.updateOne({ _id: req.params.id }, { ...updatedBookData, _id: req.params.id });

    // Réponse réussie avec le livre mis à jour
    res.status(200).json({
      message: 'Livre modifié avec succès !',
      updatedBook: { ...updatedBookData, _id: req.params.id },
    });

  } catch (error) {
    console.error('Erreur lors de la modification du livre :', error);
    res.status(500).json({ error: 'Erreur lors de la modification du livre', details: error.message });
  }
};
