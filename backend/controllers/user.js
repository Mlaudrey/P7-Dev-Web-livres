const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const passwordValidator = require("password-validator");
const validator = require("validator");
require("dotenv").config();

// validation du mot de passe
const schemaPassword = new passwordValidator();
schemaPassword
  .is().min(8) 
  .is().max(100) 
  .has().lowercase() 
  .has().uppercase(1) 
  .has().digits(2)  
  .has().not().spaces();

// fonction de validation du mot de passe
const isValidPwd = (password) => schemaPassword.validate(password);

// fonction pour générer des messages d'erreur détaillés sur le mot de passe
const validationMessages = (password) => {
  const arr = schemaPassword.validate(password, { details: true });
  return arr.map(e => e.message).join(' *** ');
};

// fonction pour gérer l'inscription d'un utilisateur
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validation de l'email
  if (!validator.isEmail(email)) {
    return res.status(422).json({ error: "Adresse email invalide." });
  }

  // 2. Validation du mot de passe
  if (!isValidPwd(password)) {
    return res.status(400).json({ error: validationMessages(password) });
  }

  try {
    // 3. Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Création d'un utilisateur
    const user = new User({ email, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: "Utilisateur créé avec succès !" });

  } catch (error) {
    if (error.code === 11000) { // email déjà utilisé
      return res.status(400).json({ error: "Cette adresse e-mail est déjà utilisée." });
    }
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

// fonction pour gérer la connexion d'un utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Utilisateur ou mot de passe incorrect." });
    }

    // comparaison des mots de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Utilisateur ou mot de passe incorrect." });
    }

    // génération du token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      userId: user._id,
      token,
    });

  } catch (error) {
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
};
