const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const receiptSchema = new Schema(
  {
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    supplier_id: {
      type: mongoose.Types.ObjectId,
      ref: "Supplier",
    },
    total_price: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Receipt", receiptSchema);
