const express = require("express");

const app = express();

app.get(
  "/user",
  (req, res, next) => {
    next();
    console.log("first response ");
    res.send("Hey thanush");
  },
  (req, res, next) => {
    console.log("second response");
    next();

    res.send("hello there");
  },
  (rea, res) => {
    res.send("3rd one");
  }
);

app.listen(7777, () => {
  console.log("Server started successfully listening on port 7777");
});
