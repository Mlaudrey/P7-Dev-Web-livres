const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://audrey:mlKjyT@cluster0.oxi2m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
 
app.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'Livre créé !'
    });
});

app.get('/api/stuff', (req, res, next) => {
    const stuff = [
        {
            _id: 'oiuytr',
            title: 'mon premier livre',
            description: 'Les infos du premier livre',
            imageUrl:'',
            Note:'',
            userId:'gegzffz',
        },
        {
            _id: 'oiuytrteb',
            title: 'mon deuxième livre',
            description: 'Les infos du deuxième livre',
            imageUrl:'',
            Note:'',
            userId:'gegzffz',
        },
    ];
    res.status(200).json(stuff);
});

module.exports= app;