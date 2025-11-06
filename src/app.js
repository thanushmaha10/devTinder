const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Thanush", lastName: "Maha" });
});

app.post("/user", (req, res) => {
  res.send("post called successfully");
});

app.delete("/user", (req, res) => {
  res.send("user deleted suceesfully");
});

app.use("/test", (req, res) => {
  res.send("Test Page");
});

app.listen(7777, () => {
  console.log("Server started successfully listening on port 7777");
});
