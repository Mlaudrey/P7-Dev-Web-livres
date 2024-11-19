const express = require('express');
const router = express.Router();
const { upload, processImage } = require('../middleware/multerconfig'); // Import du fichier multerconfig

// route POST pour uploader une image
router.post('/upload', upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }

    // traitement de l'image
    const filename = await processImage(req.file.buffer, req.file.originalname);
    res.status(200).json({ message: 'Image téléchargée et optimisée', filename });

  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du téléchargement ou traitement de l\'image', error: error.message });
  }
});

module.exports = router;
