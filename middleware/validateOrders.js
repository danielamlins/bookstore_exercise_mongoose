const { check } = require("express-validator");

exports.validateNewOrder = [
  check("itemId", "ID is required").notEmpty().isString().trim(),
  check("qtt", "Quantity is required").notEmpty().isInt().trim(),
];

exports.validateUpdateOrder = [
    check("itemId", "ID is required").optional().isString().trim(),
    check("qtt", "Quantity is required").optional().isInt().trim(),
];
