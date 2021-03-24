const express = require("express");
const router = express.Router();


const {
  addUser,
  getUser,
  getUserById,
  updateUser,
  removeUser,
  login,
  logout,
  refreshToken
} = require("../controller/usersController");
const morgan = require("morgan");

const { check, validationResult } = require("express-validator");
const {
  validateNewUser,
  validateUpdateUser,
} = require("../middleware/validateUsers");
const { UserData } = require("../models/userModel");
const auth = require('../middleware/authenticateToken');

// Routes
router
  .route("/")
  .get((req, res) => {
    getUser(req, res, "users");
  })
  .post(validateNewUser, (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      res.json(errors);
      // Dilshod - put this function in a middleware which returns the array of validation and a function (req, res, next) => {}
      //return next()
    }

    addUser(req, res);
    // Dilshod
    // const extractedErrors = [];
    // errors.array().map(err =>extractedErrors.push({[err.param]: err.msg}));
    // return res.status(422).json({
    //   errors: extractedErrors
    // })
  });


router
  .route("/:id")
  .get((req, res) => {
    getUserById(req, res);
  })
  .put(auth, (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      res.json(errors);
    } else {
      updateUser(req, res);
    }
  })
  .delete(auth, (req, res) => {
    removeUser(req, res);
  });

router.route("/login").post((req, res) => {
  login(req, res)
});

router.route("/logout").post((req, res) => {
  logout(req, res)
});

router.post("/token", (req, res) => {
  refreshToken();
})

module.exports = router;
