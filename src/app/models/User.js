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
  date_of_birth: {
    type: Date,
    default: new Date("2000-01-01"),
  },
  avatar: {
    type: String,
    default: null,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", User);
