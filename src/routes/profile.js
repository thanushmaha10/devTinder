const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const {
  validateUserEditData,
  validatePasswordEditData,
} = require("../utils/validation");
// const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateUserEditData(req)) {
      throw new Error("Invalid Edit request");
    }

    const loggedinUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedinUser[key] = req.body[key]));

    await loggedinUser.save();
    res.json({
      message: loggedinUser.firstName + ",your profile updated successfully",
      loggedinUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validatePasswordEditData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const newPassword = req.body.password;
    const loggedinUser = req.user;
    const isPasswordValid = await loggedinUser.validatePassword(newPassword);

    if (isPasswordValid) {
      throw new Error("password cannot be same as old password");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("password is not strong");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedinUser["password"] = passwordHash;
    // Object.keys(req.body).forEach((key) => (loggedinUser[key] = req.body[key]));
    await loggedinUser.save();

    res.send("Your password has been updated successfully");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
