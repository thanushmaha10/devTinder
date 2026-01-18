const express = require("express");
const { userAuth } = require("../middleware/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const Users = require("../models/user");
const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photoUrl",
  "skills",
  "about",
];

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User feed, connections, and requests APIs
 */

/**
 * @swagger
 * /user/requests/received:
 *   get:
 *     summary: Get received connection requests
 *     tags: [Users]
 *     description: Fetch all incoming connection requests with status "interested" for the logged-in user.
 *     responses:
 *       200:
 *         description: Connection requests fetched successfully
 *       401:
 *         description: Unauthorized
 */

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedinUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

/**
 * @swagger
 * /user/connections:
 *   get:
 *     summary: Get user connections
 *     tags: [Users]
 *     description: Fetch all accepted connections for the logged-in user.
 *     responses:
 *       200:
 *         description: Connections fetched successfully
 *       401:
 *         description: Unauthorized
 */

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedinUser, status: "accepted" },
        { toUserId: loggedinUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedinUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

/**
 * @swagger
 * /feed:
 *   get:
 *     summary: Get user feed
 *     tags: [Users]
 *     description: Fetch a paginated feed of users excluding existing connections and requests.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of users per page (maximum 50)
 *     responses:
 *       200:
 *         description: User feed fetched successfully
 *       401:
 *         description: Unauthorized
 */

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await Users.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: "ERROR" + err.message });
  }
});

module.exports = userRouter;
