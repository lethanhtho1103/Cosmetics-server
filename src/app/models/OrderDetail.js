const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderDetail = new Schema({
  order_id: { type: mongoose.Types.ObjectId, ref: "Order" },
  product_id: { type: mongoose.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 0 },
  unit_price: { type: Number, default: 0 },
});

module.exports = mongoose.model("OrderDetail", OrderDetail);
