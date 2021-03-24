const { check } = require("express-validator");
const { validate } = require("../models/bookModel");

exports.validateNewUser = [
  check("firstName", "First Name is required").notEmpty().isString().trim().escape(),
  check("lastName", "Last Name is required").notEmpty().isString().trim().escape(),
  check("email", "Email is required")
    .isEmail().withMessage('Please, insert valid email').normalizeEmail(),
  check("password", "Password is required").isLength({min: 6}).withMessage('Password must have at least 6 characters').custom((value, {req}) => {
      console.log(value);
      console.log(req.body.password_confirmation)
      if(value !== req.body.password_confirmation) {
          throw new Error("Password confirmation does not match the password.")
      } else {
          return value;
      }
  }),
];

exports.validateUpdateUser = [
    check("firstName", "First Name is required").optional().isString().trim(),
    check("lastName", "Last Name is required").optional().isString().trim(),
    check("email", "Email is required")
      .isEmail().withMessage('Please, insert valid email').normalizeEmail(),
    check("password", "Password is required").optional().isLength({min: 6}).withMessage('Password must have at least 6 characters'),
];

