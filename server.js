require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./src/config/database");

const PORT = process.env.PORT || 7777;

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log("Server started successfully listening on port " + PORT);
    });
  })
  .catch(() => {
    console.error("Database not connected");
  });
