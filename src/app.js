const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const countryRoutes = require("./routes/countryRoutes");
const statusRoutes = require("./routes/statusRoutes");
const imageRoutes = require("./routes/imageRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/countries", countryRoutes);
app.use("/status", statusRoutes);
app.use("/image", imageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Country Currency & Exchange API running..." });
});

// Sync DB
sequelize
  .sync()
  .then(() => console.log("✅ Database connected and synced"))
  .catch((err) => console.error("❌ DB connection failed:", err));

module.exports = app;
