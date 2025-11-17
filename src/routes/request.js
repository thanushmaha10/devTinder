const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sending a connection request");
  res.send(user.firstName + "Sent you a connection Request");
});

module.exports = requestRouter;
