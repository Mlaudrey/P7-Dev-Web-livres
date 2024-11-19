const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// je charge les variables d'environnement depuis le fichier .env
require('dotenv').config(); 

const bookRoutes = require('./routes/book.js'); 
const userRoutes = require('./routes/user.js');  

// j'utilise la variable d'environnement MONGODB_URI pour se connecter à MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// middleware pour les en-têtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// routes pour les livres 
app.use('/api/books', bookRoutes);

// routes pour l'authentification des utilisateurs
app.use('/api/auth', userRoutes);

// route pour servir les fichiers d'images statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

// middleware global de gestion des erreurs
app.use((error, req, res, next) => {
  console.error(error.stack); 
  res.status(error.status || 500).json({
    message: error.message || 'Une erreur serveur est survenue'
  });
});

module.exports = app;
