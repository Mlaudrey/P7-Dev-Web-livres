const mongoose = require("mongoose");
const Book = require("../../Models/book");

exports.getAllBooks = async (req, res, next) => {
  try {
   
    const books = await Book.find({});

    // retourne la liste des livres avec un code 200
    res.status(200).json(books);
  } catch (error) {
   
    res.status(500).json({ error: "Erreur lors de la récupération des livres", details: error.message });
  }
};
