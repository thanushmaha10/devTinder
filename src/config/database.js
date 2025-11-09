const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://thanushmaha10_db_user:Meenachi1004@devtinder.03pfbn9.mongodb.net/?appName=devTinder/devTinder"
  );
};

module.exports = connectDb;
