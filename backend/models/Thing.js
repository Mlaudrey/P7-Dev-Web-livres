const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
    //schéma de données pour les livres
  userId: { type: mongoose.Schema.Types.ObjectId,ref: "user", required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  rating:{},
  averageRating:{ type: Number, required: true },
});

module.exports = mongoose.model('Thing', thingSchema);