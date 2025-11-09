const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    console.log(req.body);
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
