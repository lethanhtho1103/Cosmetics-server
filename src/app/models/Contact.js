const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Contact = new Schema({
  name: {
    type: String,
    required: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 35,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contact_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", Contact);
