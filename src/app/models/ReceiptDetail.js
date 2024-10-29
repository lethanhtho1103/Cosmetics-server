const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const receiptDetailSchema = new Schema({
  receipt_id: { type: mongoose.Types.ObjectId, ref: "Receipt" },
  product_id: { type: mongoose.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 0 },
  import_price: { type: Number, default: 0 },
});

module.exports = mongoose.model("ReceiptDetail", receiptDetailSchema);
