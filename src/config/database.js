const mongoose = require("mongoose");

let isConnected = false;

const connectDb = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
  isConnected = true;
};

module.exports = connectDb;
