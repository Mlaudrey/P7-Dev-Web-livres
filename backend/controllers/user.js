const bcrypt = require('bcrypt'); 
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
  console.log('Mot de passe reçu lors de l\'inscription:', password);

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
    console.log('Mot de passe haché:', hashedPassword);

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
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Utilisateur non trouvé : ${email}`);
      return res.status(401).json({ error: "Utilisateur ou mot de passe incorrect." });
    }

    // Nettoyer le mot de passe reçu (enlever espaces éventuels)
    const passwordToCompare = password.trim();
    console.log('Mot de passe reçu:', passwordToCompare);
    console.log('Mot de passe haché en base:', user.password);
    
    // Comparaison des mots de passe
    const validPassword = await bcrypt.compare(passwordToCompare, user.password);
    console.log('Résultat de la comparaison des mots de passe:', validPassword);
    
    if (!validPassword) {
      console.log(`Mot de passe incorrect pour l'utilisateur : ${email}`);
      return res.status(401).json({ error: "Utilisateur ou mot de passe incorrect." });
    }

    // Si l'utilisateur est authentifié, génération du token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
    console.log(`Connexion réussie pour l'utilisateur : ${email}`);

    // réponse avec le token JWT et l'ID de l'utilisateur
    return res.status(200).json({
      userId: user._id,
      token,
    });

  } catch (error) {
    console.error(`Erreur lors de la connexion de l'utilisateur : ${email}`, error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
};
