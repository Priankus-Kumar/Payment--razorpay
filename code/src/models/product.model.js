const mongoose = require("mongoose");

const productmodal = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
  },
});

const product=mongoose.model("product",productmodal)
module.exports=product