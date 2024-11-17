const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// configuration de multer avec MemoryStorage pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

// Initialise multer avec le stockage en mémoire et limiter la taille des fichiers à 4 Mo
const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, 
});

// fonction pour traiter et sauvegarder les images
const processImage = async (fileBuffer, originalName) => {
  const imagesDir = path.join(__dirname, '../images'); 

  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }

  
  const timestamp = Date.now();
  const extension = 'webp'; 
  const newFilename = `${originalName.split(' ').join('_')}_${timestamp}.${extension}`;
  const outputPath = path.join(imagesDir, newFilename);

  // Utilise Sharp pour convertir et sauvegarder l'image en WebP
  await sharp(fileBuffer)
    .webp({ quality: 80 }) 
    .toFile(outputPath);

  return newFilename; // renvoie le nom du fichier sauvegardé
};

// middleware multer pour gérer l'upload d'une seule image
module.exports = {
  upload: upload.single('image'), 
  processImage, // fonction de traitement d'image
};
