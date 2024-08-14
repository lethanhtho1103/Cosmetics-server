const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
  name: {
    type: String,
    required: true,
  },
  cosmetic_id: {
    type: mongoose.Types.ObjectId,
    ref: "Cosmetic",
  },
});

module.exports = mongoose.model("Category", Category);
