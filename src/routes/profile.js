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

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management APIs
 */

/**
 * @swagger
 * /profile/view:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Profile]
 *     description: Fetch the profile details of the authenticated user.
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Unauthorized
 */

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

/**
 * @swagger
 * /profile/edit:
 *   patch:
 *     summary: Edit user profile
 *     tags: [Profile]
 *     description: Update editable fields of the authenticated user's profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               age: 25
 *               about: Software Developer
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid edit request
 *       401:
 *         description: Unauthorized
 */

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
      data: loggedinUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

/**
 * @swagger
 * /profile/password:
 *   patch:
 *     summary: Update user password
 *     tags: [Profile]
 *     description: Change the password of the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: StrongPass@123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid password or validation failed
 *       401:
 *         description: Unauthorized
 */

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
