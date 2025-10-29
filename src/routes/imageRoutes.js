const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  const imagePath = path.join(__dirname, "../../cache/summary.png");

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: "Summary image not found" });
  }

  res.sendFile(imagePath);
});

module.exports = router;
