const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("db is connected");
};

module.exports = connectDB;
