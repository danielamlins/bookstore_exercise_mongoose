const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    address: {type: Schema.Types.ObjectID, ref: 'address'}
  },
  { collection: "users" }
);

const addressSchema = new Schema({
  street: String,
  city: String,
});

const UserData = mongoose.model("users", userSchema);
const AddressData = mongoose.model("address", addressSchema);

module.exports = { UserData, AddressData };
