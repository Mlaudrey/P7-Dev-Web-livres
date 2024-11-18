const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');  

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

// middleware pour hacher le mot de passe avant de l'enregistrer
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Si le mot de passe n'est pas modifié, ne rien faire

  try {
   // const salt = await bcrypt.genSalt(10);  // Générer un salt pour rendre le hachage plus sécurisé
    this.password = await bcrypt.hash(this.password, 10);  // Hacher le mot de passe avec le salt
    next();
  } catch (err) {
    next(err);
  }
});

// méthode pour comparer le mot de passe lors de la connexion
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);  // Comparer le mot de passe fourni avec le haché
};

module.exports = mongoose.model('User', userSchema);
