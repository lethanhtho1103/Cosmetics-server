const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 35,
  },
  password: {
    type: String,
    minLength: 8,
  },
  type: {
    type: String,
    defaultValue: "LOCAL",
  },
  province: {
    type: String,
    defaultValue: "",
  },
  district: {
    type: String,
    defaultValue: "",
  },
  ward: {
    type: String,
    defaultValue: "",
  },
  address: {
    type: String,
    minLength: 5,
    defaultValue: "",
  },
  phone: {
    type: String,
  },
  avatar: {
    type: String,
    default: null,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", User);
