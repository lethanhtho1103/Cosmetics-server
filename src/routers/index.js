const auth = require("./auth");
const cosmetic = require("./cosmetic");
const category = require("./category");
const shop = require("./shop");

function route(app) {
  app.use("/api/authentication", auth);
  app.use("/api/shop", shop);
  app.use("/api/cosmetic", cosmetic);
  app.use("/api/category", category);
}

module.exports = route;
