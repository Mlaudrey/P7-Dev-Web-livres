const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    // schéma de données pour les livres
    userId: { 
        type: String,
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    author: { 
        type: String, 
        required: true 
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    year: { 
        type: Number, 
        required: true 
    },
    genre: { 
        type: String, 
        required: true 
    },
    // champ `rating`, qui est un tableau d'objets contenant `userId` et `grade`
    ratings: [
        { 
            userId: { 
                type: String, 
                required: true 
            },
            grade: { 
                type: Number, 
                required: true, 
                min: 0, 
                max: 5 
            }
        }
    ],
    // calcul de la moyenne des notes
    averageRating: { 
        type: Number, 
        required: false,
    }
});


module.exports = mongoose.model('Book', bookSchema);
