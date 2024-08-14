const auth = require("./auth");

function route(app) {
  app.use("/api/authentication", auth);
}

module.exports = route;
