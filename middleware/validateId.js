const ObjectID = require("mongodb").ObjectID;
const bookData = require("../models/bookModel");
const userData = require("../models/userModel");
const orderData = require("../models/orderModel");

exports.validateId = function (req, res, next, key) {
    console.log(req.params.id)
    console.log(key)
  const model =
    key === "books"
      ? bookData
      : key === "orders"
      ? orderData
      : key === "users"
      ? userData
      : null;

  console.log(model)
  model.findById({ _id: ObjectID(req.params.id) }, (err, doc) => {
    if (err || !doc) {
      console.log(err);
      return res.json({
        error: {
          message: "ID Not Found",
        },
      });
    }
    next();
  });
};
