const express = require("express");
const router = express.Router();
const {
  getOrder,
  addOrder,
  getOrderById,
  updateOrder,
  removeOrder,
} = require("../controller/ordersController");

const { check, validationResult } = require("express-validator");
const {
  validateNewOrder,
  validateUpdateOrder,
} = require("../middleware/validateOrders");

// Routes
router
  .route("/")
  .get((req, res) => {
    getOrder(req, res);
  })
  .post(validateNewOrder, (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      console.log(errors);
      res.json(errors);
    } else {
      addOrder(req, res);
    }
  });

router
  .route("/:id")
  .get((req, res) => {
    getOrderById(req, res);
  })
  .put(validateUpdateOrder, (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      res.json(errors);
    } else {
      updateOrder(req, res);
    }
  })
  .delete((req, res) => {
    removeOrder(req, res);
  });

module.exports = router;
