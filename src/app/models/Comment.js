const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  product_id: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
  star: {
    type: Number,
  },
  content: {
    type: String,
  },
  comment_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", Comment);
