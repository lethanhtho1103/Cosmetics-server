const auth = require("./auth");
const cosmetic = require("./cosmetic");
const category = require("./category");
const shop = require("./shop");
const product = require("./product");

function route(app) {
  app.use("/api/authentication", auth);
  app.use("/api/shop", shop);
  app.use("/api/cosmetic", cosmetic);
  app.use("/api/category", category);
  app.use("/api/product", product);
}

module.exports = route;
