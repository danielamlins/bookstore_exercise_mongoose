const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    author: String,
    title: String,
    year: Number,
    price: Number,
  },
  { collection: "books" }
)

const BookData = mongoose.model('books', bookSchema);

module.exports = BookData;