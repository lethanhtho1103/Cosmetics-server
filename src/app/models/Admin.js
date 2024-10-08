const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Admin = new Schema({
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
    default: true,
  },
});

module.exports = mongoose.model("Admin", Admin);
