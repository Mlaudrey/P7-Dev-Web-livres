const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors');

const app = express();
app.use(cors());

// je charge les variables d'environnement depuis le fichier .env
require("dotenv").config();

const bookRoutes = require("./routes/book.js");
const userRoutes = require("./routes/user.js");

// j'utilise la variable d'environnement MONGODB_URI pour se connecter à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
// middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// routes pour les livres (operation CRUD)
app.use("/api/books", bookRoutes);
// routes pour l'authentification des utilisateurs(CRUD)
app.use("/api/auth", userRoutes);

// route pour servir les fichiers d'images statique, images téléchargés par les utilisateurs
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.status(401).json({
    error: "unauthorized",
    message: "vous n'êtes pas autorisé à accéder à cette route",
  });
});

module.exports = app;
