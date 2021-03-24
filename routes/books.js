const express = require("express");
const router = express.Router();
const {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  removeBook,
} = require("../controller/booksController");
const { check, validationResult } = require("express-validator");
const { validateBook, validateUpdateBook } = require("../middleware/validateBook");
const { update } = require("../models/bookModel");

// Routes

router
  .route("/")
  .get((req, res) => {
    getBooks(req, res);
  })
  .post(validateBook, (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      res.json(errors);
    } else {
      addBook(req, res);
    }
  });

router
  .route("/:id")
  .get((req, res) => {
    getBookById(req, res);
  })
  .put(validateUpdateBook, (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      res.json(errors);
    } else {
      updateBook(req, res);
    }
  })
  .delete((req, res) => {
    removeBook(req, res);
  });

// https://stackoverflow.com/questions/22463299/express-middleware-access-to-req-params/43992902
module.exports = router;
