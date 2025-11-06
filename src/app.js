const express = require("express");

const app = express();

app.get("/user/:userid/:name/:pwd", (req, res) => {
  console.log(req.params);
  console.log(req.query);
  res.send({ firstName: "Thanush", lastName: "Maha" });
});

app.listen(7777, () => {
  console.log("Server started successfully listening on port 7777");
});
