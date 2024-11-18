const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    // schéma de données pour les livres
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // utilise "User" en majuscule car c'est le modèle de l'utilisateur
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
    rating: [
        { 
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "User",  
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
        default: 0  // ajoute une valeur par défaut (0) si aucune note n'est présente
    }
});

// méthode pour recalculer la moyenne à chaque fois qu'une note est ajoutée
bookSchema.methods.calculateAverageRating = function() {
    if (this.rating.length === 0) return 0; // pas de notes => moyenne = 0
    const total = this.rating.reduce((acc, rating) => acc + rating.grade, 0);
    return total / this.rating.length;
};

// ajout d'un middleware `pre-save` pour recalculer `averageRating` avant chaque enregistrement
bookSchema.pre('save', function(next) {
    this.averageRating = this.calculateAverageRating();  // Assurez-vous que c'est `bookSchema`
    next();
});

module.exports = mongoose.model('Book', bookSchema);
