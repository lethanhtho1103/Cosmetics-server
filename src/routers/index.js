const auth = require("./auth");
const cosmetic = require("./cosmetic");
const category = require("./category");
const shop = require("./shop");
const product = require("./product");
const cart = require("./cart");
const order = require("./order");
const contact = require("./contact");
const comment = require("./comment");
const statistics = require("./statistics");
const promotion = require("./promotion");
const product_promotion = require("./product_promotion");
const supplier = require("./supplier");
const receipt = require("./receipt");
const receiptDetail = require("./receiptDetail");

const google = require("./google");
const facebook = require("./facebook");
const paypal = require("./paypal");

function route(app) {
  app.use("/api/authentication", auth);
  app.use("/api/shop", shop);
  app.use("/api/cosmetic", cosmetic);
  app.use("/api/category", category);
  app.use("/api/product", product);
  app.use("/api/cart", cart);
  app.use("/api/order", order);
  app.use("/api/contact", contact);
  app.use("/api/comment", comment);
  app.use("/api/statistics", statistics);
  app.use("/api/promotions", promotion);
  app.use("/api/products/promotions", product_promotion);
  app.use("/api/suppliers", supplier);
  app.use("/api/receipts", receipt);
  app.use("/api/receipt-detail", receiptDetail);

  app.use("/", facebook);
  app.use("/", google);
  app.use("/", paypal);
}

module.exports = route;
