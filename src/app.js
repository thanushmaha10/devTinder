const express = require("express");
const { userAuth } = require("./middleware/auth.js");

const app = express();

app.use("/user", userAuth);

app.get("/user/admin", (req, res, next) => {
  console.log("first response ");
  res.send("Hey admin");
});

app.get("/user/thanush", (req, res) => {
  res.send("Welcome thanush");
});

app.listen(7777, () => {
  console.log("Server started successfully listening on port 7777");
});
