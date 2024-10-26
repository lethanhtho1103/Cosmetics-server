const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  order_date: { type: Date, default: Date.now },
  total_price: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "denied", "shipped", "delivered"],
    required: true,
  },
  is_payment: {
    type: String,
    enum: ["yes", "no"],
    required: true,
    default: "no",
  },
  delivery_status: {
    type: String,
    default: "Order placed",
  },
  shipping_method: {
    type: String,
    enum: ["standard", "express"],
    required: true,
  },
  shipping_cost: { type: Number, default: 0 },
});

module.exports = mongoose.model("Order", OrderSchema);
