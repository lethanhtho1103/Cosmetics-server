const auth = require("./auth");
const cosmetic = require("./cosmetic");
const category = require("./category");

function route(app) {
  app.use("/api/authentication", auth);
  app.use("/api/cosmetic", cosmetic);
  app.use("/api/category", category);
}

module.exports = route;
