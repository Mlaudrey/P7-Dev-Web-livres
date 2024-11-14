const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
    // schéma de données pour les livres
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", 
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
                ref: "user", 
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
        required: false  
    }
});

// méthode pour recalculer la moyenne à chaque fois qu'une note est ajoutée
thingSchema.methods.calculateAverageRating = function() {
    if (this.rating.length === 0) return 0; // pas de notes => moyenne = 0
    const total = this.rating.reduce((acc, rating) => acc + rating.grade, 0);
    return total / this.rating.length;
};

// ajout d'un middleware `pre-save` pour recalculer `averageRating` avant chaque enregistrement
thingSchema.pre('save', function(next) {
    this.averageRating = this.calculateAverageRating();
    next();
});

module.exports = mongoose.model('Book', thingSchema);
