const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
  },
  image: {
    type: String,
    default: "",
  },
  category_id: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  specifications: {
    type: String,
  },
  cpu_type: {
    type: String,
  },
  ram: {
    type: String,
  },
  storage: {
    type: String,
  },
  display: {
    type: String,
  },
  graphics: {
    type: String,
  },
  connectivity: {
    type: String,
  },
  mouse_keyboard: {
    type: String,
  },
  size: {
    type: String,
  },
  weight: {
    type: String,
  },
  color: {
    type: String,
  },
  warranty: {
    type: String,
  },
  other_features: {
    type: String,
  },
  manufacturer: {
    type: String,
  },
  model: {
    type: String,
  },
  screenType: {
    type: String,
  },
  brightness: {
    type: String,
  },
  contrastRatio: {
    type: String,
  },
  screenSize: {
    type: String,
  },
  panelType: {
    type: String,
  },
  viewingAngle: {
    type: String,
  },
  responseTime: {
    type: String,
  },
  conectivity: {
    type: String,
  },
  aspectRatio: {
    type: String,
  },
  refreshRate: {
    type: String,
  },
  recommendedResolution: {
    type: String,
  },
  review: {
    type: String,
  },
  mainboard: {
    type: String,
  },
  radiators: {
    type: String,
  },
  hardDrive: {
    type: String,
  },
  card: {
    type: String,
  },
  caseTower: {
    type: String,
  },
  psu: {
    type: String,
  },
  material: {
    type: String,
  },
  high: {
    type: String,
  },
  mouseType: {
    type: String,
  },
  utilities: {
    type: String,
  },
  ergonomics: {
    type: String,
  },
  requestSystem: {
    type: String,
  },
  guarantee: {
    type: String,
  },
  keyboardType: {
    type: String,
  },
  hearType: {
    type: String,
  },
  average_star: { type: Number, default: 0 },
  comment_count: { type: Number, default: 0 },
  sold_quantity: { type: Number, default: 0 },
});

module.exports = mongoose.model("Product", Product);
