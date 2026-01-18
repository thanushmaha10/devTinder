const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const mongoose = require("mongoose");

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Connection request management APIs
 */

/**
 * @swagger
 * /request/send/{status}/{userId}:
 *   post:
 *     summary: Send a connection request
 *     tags: [Requests]
 *     description: Send a connection request to another user with status interested or ignored.
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [interested, ignored]
 *         description: Status of the connection request
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Target user ID
 *     responses:
 *       200:
 *         description: Connection request sent successfully
 *       400:
 *         description: Invalid request or request already exists
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type" + status });
      }

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(404).json({ message: "User Not Found" });
      }

      const toUser = await User.findById({ _id: toUserId });
      if (!toUser) {
        return res.status(404).json({ message: "User Not Found" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already sent" });
      }

      // if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
      //   return res
      //     .status(400)
      //     .json({ message: "Cannot send connection request to yourself" });
      // }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await newConnectionRequest.save();

      const statusMessage =
        status === "interested" ? " is interested in " : " ignored ";

      res.json({
        message: req.user.firstName + statusMessage + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  },
);

/**
 * @swagger
 * /request/review/{status}/{requestId}:
 *   post:
 *     summary: Review a connection request
 *     tags: [Requests]
 *     description: Accept or reject a received connection request.
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [accepted, rejected]
 *         description: Review status
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: Connection request ID
 *     responses:
 *       200:
 *         description: Connection request reviewed successfully
 *       400:
 *         description: Invalid status or request
 *       404:
 *         description: Connection request not found
 *       401:
 *         description: Unauthorized
 */

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const allowedStatus = ["accepted", "rejected"];
      const { status, requestId } = req.params;
      const isAllowedStatus = allowedStatus.includes(status);
      if (!isAllowedStatus) {
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!existingConnectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request not found" });
      }

      existingConnectionRequest.status = status;
      const data = await existingConnectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  },
);

module.exports = requestRouter;
