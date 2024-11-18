const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// fonction d'inscription (signup)
exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // créer un nouvel utilisateur
    const user = new User({ email, password });
    await user.save();  // enregistre l'utilisateur dans la base de données

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// fonction de connexion (login)
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // cherche l'utilisateur dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // compare le mot de passe fourni avec celui haché dans la base de données
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // créer un token JWT
    const token = jwt.sign(
      { userId: user._id },  // données à inclure dans le token (userId)
      process.env.JWT_SECRET || 'RANDOM_SECRET_KEY',  // clé secrète
      { expiresIn: '24h' }  // le token expire après 24 heures
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
