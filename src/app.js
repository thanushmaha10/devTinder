const express = require("express");
const bcrypt = require("bcrypt");
const connectDb = require("./config/database");
const validator = require("validator");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    validateSignUpData(req);
    // if (skills?.length > 10) {
    //   throw new Error("skill cannot be more than 10");
    // }
    await user.save();
    // console.log(req.body);
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email address");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login successfull Welocome " + user.firstName);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.find({ email: userEmail });
    console.log(user);
    if (!user.length) {
      res.status(404).send("user Not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("user Deleted successfully");
  } catch {
    res.status(404).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const userData = req.body;
  // console.log(userData);
  try {
    const ALLOWED_UPDATES = ["photoUrl", "age", "about", "skills", "password"];
    const isAllowed = Object.keys(userData).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isAllowed) {
      throw new Error("Update not allowed");
    }
    if (userData?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, userData, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User Updated Sucessfully");
  } catch (err) {
    res.status(404).send("Something went wrong" + err.message);
  }
});

// app.patch("/updateuser", async (req, res) => {
//   const userMail = req.body.email;
//   const userPwd = req.body.password;
//   try {
//     const user = await User.updateOne(
//       { email: userMail },
//       { password: userPwd }
//     );
//     res.send("User password Updated Sucessfully");
//   } catch {
//     res.status(404).send("Something went wrong");
//   }
// });

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("Something went Wrong");
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
