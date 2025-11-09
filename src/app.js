const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Thanush",
    lastNme: "Maha",
    email: "thanush@maha.com",
    password: "thanush@123",
    age: 23,
    gender: "M",
  });

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the data" + err.message);
  }
});

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server started successfully listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database not connected");
  });
