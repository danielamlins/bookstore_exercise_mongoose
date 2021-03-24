const { check } = require("express-validator");

exports.validateBook = [
  check("author", "Author is required").notEmpty().isString().trim(),
  check("title", "Title is required").notEmpty().isString().trim(),
  check("year", "Year is required")
    .notEmpty()
    .isInt()
    .isLength({ min: 4, max: 4 })
    .withMessage("Year should be a 4 characters number")
    .trim(),
  check("price", "Price is required").notEmpty().isFloat().trim(),
];

exports.validateUpdateBook = [
  check("author").optional().isString().trim(),
  check("title").optional().isString().trim(),
  check("year")
    .optional()
    .isInt()
    .isLength({ min: 4, max: 4 })
    .withMessage("Year should be a 4 characters number")
    .trim(),
  check("price", "Price is required").isFloat().trim(),
];

