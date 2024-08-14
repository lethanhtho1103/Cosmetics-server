const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
  },
  origin: {
    type: String,
    required: true,
  },
  trademark: {
    type: String,
    required: true,
  },
  expiry: {
    type: Number,
  },
  image: {
    type: String,
    default: "",
  },
  average_star: { type: Number, default: 0 },
  comment_count: { type: Number, default: 0 },
  sold_quantity: { type: Number, default: 0 },
  category_id: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
});

module.exports = mongoose.model("Product", Product);
