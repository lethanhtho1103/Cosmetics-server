const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const config = require("./config");
const db = require("./utils/mongodb.util");
const route = require("./routers");

const app = express();
const PORT = config.app.port;
db.connect();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "upload")));
app.use(express.urlencoded({ extended: true }));

route(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
