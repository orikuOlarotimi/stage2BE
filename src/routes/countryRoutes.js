const express = require("express");
const router = express.Router();
const countryController = require("../controllers/countryController");

// POST /countries/refresh
router.post("/refresh", countryController.refresh);
router.get("/image", countryController.getSummaryImage);


router.get("/", countryController.getAll);
router.get("/:name", countryController.getOne);
router.delete("/:name", countryController.deleteOne);


module.exports = router;
