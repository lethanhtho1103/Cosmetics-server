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
    enum: ["pending", "accepted", "denied", "shipped", "delivered"],
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
});

module.exports = mongoose.model("Order", OrderSchema);
