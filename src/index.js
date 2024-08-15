const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
dotenv.config();

const config = require("./config");
const db = require("./utils/mongodb.util");
const route = require("./routers");
const configLoginWithGoogle = require("./app/controllers/social/GoogleController.js");
const configLoginWithFacebook = require("./app/controllers/social/FacebookController.js");

const app = express();
const PORT = config.app.port;
db.connect();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "upload")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
configLoginWithGoogle();
configLoginWithFacebook();
route(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
