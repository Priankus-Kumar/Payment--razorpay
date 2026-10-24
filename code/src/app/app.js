const express = require("express");
const morgan = require("morgan");
const productRoute = require("../routes/payment.route");
const app = express();
const path=require("path")


app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
})

app.use("/api/payment", productRoute);

module.exports = app;
