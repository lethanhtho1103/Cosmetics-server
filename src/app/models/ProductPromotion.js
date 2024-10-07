const mongoose = require("mongoose");

const productPromotionSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    promotion_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductPromotion = mongoose.model(
  "ProductPromotion",
  productPromotionSchema
);
module.exports = ProductPromotion;
