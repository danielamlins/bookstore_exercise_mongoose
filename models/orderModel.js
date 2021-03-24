const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: "books",
  },
  qtt: Number,
  price: Number,
});

const orderSchema = new Schema(
  {
    orderItems: [{type: Schema.Types.ObjectId, ref: "orderItems"}],
    totalPrice: Number,
  },
  { collection: "orders" }
);

const OrderData = mongoose.model("orders", orderSchema);
const OrderItemData = mongoose.model("orderItems", orderItemSchema);

module.exports = {OrderItemData, OrderData};

