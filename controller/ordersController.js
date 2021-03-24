const lowDB = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("data/db.json");
const db = lowDB(adapter);
db.defaults({ books: [], users: [], orders: [] }).write();

const { OrderItemData, OrderData } = require("../models/orderModel");
const bookData = require("../models/bookModel");
const ObjectID = require("mongodb").ObjectID;
const booksController = require("./booksController");
const { populate } = require("../models/bookModel");

exports.getOrder = function (req, res) {
  OrderData.find()
    .lean()
    // .populate({
    //   path: "orderItems",
    //   populate: {
    //     path: "books",
    //   },
    // })
    .populate("orderItems")
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => console.log(err));
};

exports.addOrder = function (req, res) {
  const order = { orderItems: [], totalPrice: 0 };
  const items = req.body;
  bookData.findOne({ _id: req.body.itemId }, (err, book) => {
    console.log(book);
    if (err || !book) {
      console.log(err);
      res.json({ err: "book not found" });
    } else {
      const orderItem = req.body;
      order.price = book.price * order.qtt;
      const newOrderItem = OrderItemData(orderItem);

      newOrderItem
        .save()
        .then((item) => {
          order.orderItems.push(item._id);
          const newOrder = new OrderData(order);
          newOrder.save();
          res.json({ success: true });
        })
        .catch((error) => console.log(error));
    }
  });

  // Save multiple books
  // Promise.all(
  //   items.map((item) => {
  //     return bookData.findOne({ _id: item.itemId }).exec((err, book) => {
  //       item.price = book.price * item.qtt;

  //       // Save the info into orderItems collection
  //       const newItem = OrderItemData(item);
  //       newItem.save().then((item) => {
  //         // Save the info into order
  //         console.log(item._id);
  //         order.orderItems.push(item._id);
  //         order.totalPrice += item.price;
  //         console.log("saved");
  //       });
  //     });

  //     //update order
  //   })
  // )
  //   .then(() => {
  //     console.log("then");
  //     console.log(order);
  //     const newOrder = OrderData(order);
  //     newOrder
  //       .save()
  //       .then(res.json({ success: true }))
  //       .catch((error) => console.log(error));
  //   })
  //   .catch((error) => console.log(error));

  // Code before reference
  // bookData.findOne({ _id: req.body.itemId }, (err, book) => {
  //   console.log(book);
  //   if (err || !book) {
  //     console.log(err);
  //     res.json({ err: "book not found" });
  //   } else {
  //     orders.forEach(order => {
  //     order.price = book.price;
  //     order.totalPrice = order.price * order.qtt;
  //     const newOrder = new OrderItemData(order);
  //     newOrder.save();
  //     res.json({ success: true });

  //     // const order = req.body;
  //     // order.price = book.price;
  //     // order.totalPrice = order.price * order.qtt;

  //     // const newOrder = new orderData(order);
  //     // newOrder.save();
  //     // res.json({ success: true });
  //   }
  // });
};

exports.getOrderById = function (req, res) {
  const id = { _id: ObjectID(req.params.id) };
  OrderData.findOne(id)
    .populate("orderitems")
    .exec((err, order) => {
      if (err) {
        console.log(error);
        res.json({ error: error.message });
      } else {
        res.json(order);
      }
    });

  //   const id = { _id: ObjectID(req.params.id) };
  // OrderData.findOne(id, (err, order) => {
  //   if (err) {
  //     console.log(error);
  //     res.json({ error: error.message });
  //   } else {
  //     res.json(order);
  //   }
  // });
};

exports.removeOrder = function (req, res) {
  const id = req.params.id;
  OrderData.findByIdAndRemove(
    { _id: ObjectID(id) },
    function (err, deletedItem) {
      if (err) {
        console.log("Error" + err);
      } else {
        console.log(deletedItem);
        res.json({ succes: true, message: "deleted" });
      }
    }
  );
};

exports.updateOrder = function (req, res) {
  const updatedOrder = req.body;
  console.log(updatedOrder.itemId);
  OrderData.find(
    { _id: ObjectID(req.params.id) },
    {"qtt": { $in: 'orderItems' } }
  ).exec((err, result) => console.log(result));

  // const newOrder = {
  //   qtt: req.body.qtt || doc.qtt,
  //   price: req.body.price || doc.price,
  // };
  // newOrder.totalPrice = newOrder.qtt * newOrder.price;
  // console.log(newOrder);
  // OrderData.updateOne(
  //   { _id: ObjectID(req.params.id) },
  //   newOrder,
  //   function (err, updatedItem) {
  //     if (err) {
  //       console.log("Error:" + err);
  //     } else {
  //       console.log("Success:" + updatedItem);
  //     }
  //     res.json(updatedItem);
  //   }
  // );
  // });

  // if (req.body.qtt === "0") {
  //   return module.exports.removeOrder(req, res);
  // }

  // FIrst Solution
  // OrderData.findOne({ _id: ObjectID(req.params.id) }, (err, doc) => {
  //   const newOrder = {
  //     qtt: req.body.qtt || doc.qtt,
  //     price: req.body.price || doc.price,
  //   };
  //   newOrder.totalPrice = newOrder.qtt * newOrder.price;
  //   console.log(newOrder);
  //   OrderData.updateOne(
  //     { _id: ObjectID(req.params.id) },
  //     newOrder,
  //     function (err, updatedItem) {
  //       if (err) {
  //         console.log("Error:" + err);
  //       } else {
  //         console.log("Success:" + updatedItem);
  //       }
  //       res.json(updatedItem);
  //     }
  //   );
  // });
};
