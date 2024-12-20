const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

//middleware de gestion des fichiers
// Configuration de multer avec MemoryStorage pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

// Liste des types MIME autorisés pour les images
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

// Initialisation de multer avec stockage en mémoire, taille maximale de 4 Mo, et validation des types MIME
const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // Limite de taille à 4 Mo
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accepte le fichier
    } else {
      cb(new Error('Type de fichier non autorisé. Seuls les fichiers jpg, jpeg, png sont autorisés.'), false);
    }
  }
});

// Fonction pour traiter et sauvegarder l'image (redimensionnement + conversion en WebP)
const processImage = async (fileBuffer, originalName) => {
  try {
    const imagesDir = path.join(__dirname, '../images');

    // Créer le dossier images s'il n'existe pas
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const timestamp = Date.now();
    const extension = 'webp';
    const safeName = slugify(originalName); 
    const newFilename = `${safeName}_${timestamp}.${extension}`;
    const outputPath = path.join(imagesDir, newFilename);

    await sharp(fileBuffer)
      .resize(800, 800, { fit: sharp.fit.inside }) 
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Retourne seulement le nom du fichier pour le chemin public
    return newFilename;
  } catch (error) {
    console.error('Erreur lors du traitement de l\'image :', error.message);
    throw new Error('Erreur lors du traitement de l\'image');
  }
};


// Export des fonctionnalités : upload et traitement d'image
module.exports = {
  upload: upload.single('image'),  // Middleware multer pour uploader une seule image
  processImage,  // Fonction pour traiter l'image (optimisation et redimensionnement)
};
