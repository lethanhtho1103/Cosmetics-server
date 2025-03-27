const { mongoose } = require("mongoose");
const Database = process.env.DATABASE;
async function connect() {
  try {
    await mongoose
      .connect(Database)
      .then(() => console.log("Connect successfully!!!"));
  } catch {
    console.log("Connect Error");
  }
}

module.exports = { connect };
