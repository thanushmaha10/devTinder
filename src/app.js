const express = require("express");

const app = express();

app.use("/admin", (req, res) => {
  res.send("Hey admin logged in");
});

app.use("/dashboard", (req, res) => {
  res.send("work in progress");
});

app.use((req, res) => {
  res.send("Hello world from the server");
});

app.listen(7777, () => {
  console.log("Server started successfully listening on port 7777");
});
