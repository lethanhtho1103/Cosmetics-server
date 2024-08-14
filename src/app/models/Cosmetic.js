const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cosmetic = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Cosmetic", Cosmetic);
