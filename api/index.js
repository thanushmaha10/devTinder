const app = require("../src/app.js");
const connectDb = require("../src/config/database.js");

export default async function handler(req, res) {
  try {
    await connectDb();
    return app(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
