const app = require("./src/app/app.js");
const connectDB=require("./src/config/db.config.js")
require("dotenv").config();
const port = process.env.PORT;

connectDB();

app.listen(port, () => {
  console.log("server is running");
});
