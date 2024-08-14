const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cosmetic = new Schema({
  name: {
    type: String,
    required: true,
  },
  shop_id: {
    type: mongoose.Types.ObjectId,
    ref: "Shop",
  },
});

module.exports = mongoose.model("Cosmetic", Cosmetic);
