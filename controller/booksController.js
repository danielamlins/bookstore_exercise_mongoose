const bookData = require("../models/bookModel");
const ObjectID = require("mongodb").ObjectID;

exports.getBooks = function (req, res) {
  bookData
    .find()
    .lean()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.addBook = function (req, res) {
  const book = req.body;
  console.log(book)
  const newBook = new bookData(book);
  newBook.save().then(res.json({ success: true })).catch(err => console.log(err));
  
};

exports.getBookById = function (req, res) {
  const id= {_id: ObjectID(req.params.id) }
  bookData.findOne(id, (err, book) => {
    if (err) {
      console.log(error);
      res.json({error: error.message})
    } else {
      res.json(book)
    }
  })
};

exports.updateBook = function (req, res) {
   bookData.findOne({ _id: ObjectID(req.params.id) }, (err, doc) => {
    const newBook = {
      title:  req.body.title || doc.title,
      author: req.body.author ||doc.author ,
      price:  req.body.price || doc.price,
      year:  req.body.year || doc.year
    }
    console.log(newBook)
    bookData.updateOne({ _id: ObjectID(req.params.id) }, newBook, function(err, updatedItem){
      if (err) {
        console.log("Error:" + err)
      } else {
        console.log("Sccess:" + updatedItem);
      }
      res.json(newBook);
    })
  })
};

exports.removeBook = function (req, res) {
  const id = req.params.id;
  console.log(id)
  bookData.findByIdAndRemove({ _id: ObjectID(id) }, function(err, deletedItem) {
    if(err){
      console.log("Error" + err)
    } else {
      console.log(deletedItem);
      res.json({succes: true, message:  "deleted"})
    }
  })
};
