const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const config = require("./config");
const db = require("./utils/mongodb.util");

dotenv.config();

const app = express();
const PORT = config.app.port;
db.connect();

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
