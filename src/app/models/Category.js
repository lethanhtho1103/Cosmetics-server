const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
  name: {
    type: String,
    required: true,
  },
  accessory_id: {
    type: mongoose.Types.ObjectId,
    ref: "Accessory",
  },
});

module.exports = mongoose.model("Category", Category);
