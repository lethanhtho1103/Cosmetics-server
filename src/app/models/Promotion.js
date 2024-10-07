const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    discount_type: {
      type: String,
      enum: ["percent", "fixed", "buy_one_get_one"],
      required: true,
    },
    discount_value: { type: Number },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;
