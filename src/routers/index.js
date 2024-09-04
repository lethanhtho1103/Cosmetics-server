const auth = require("./auth");
const cosmetic = require("./cosmetic");
const category = require("./category");
const shop = require("./shop");
const product = require("./product");
const cart = require("./cart");
const order = require("./order");
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

  app.use("/", facebook);
  app.use("/", google);
  app.use("/", paypal);
}

module.exports = route;
