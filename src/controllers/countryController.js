const {
  refreshCountries,
  getCountries,
  getCountryByName,
  deleteCountryByName,
} = require("../services/countryService");

const path = require("path");
const fs = require("fs");

exports.refresh = async (req, res) => {
  try {
    const result = await refreshCountries();
    res.json(result);
  } catch (error) {
    if (error.status === 503) {
      return res.status(503).json(error);
    }
    console.error("❌ Refresh error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { region, currency, sort } = req.query;
    const countries = await getCountries({ region, currency, sort });
    res.json(countries);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { name } = req.params;
    const country = await getCountryByName(name);
    if (!country) return res.status(404).json({ message: "Country not found" });
    res.json(country);
  } catch (error) {
    console.error("❌ Fetch single error:", error);
    res.status(500).json({ error: "Failed to fetch country" });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const { name } = req.params;
    const deleted = await deleteCountryByName(name);

    if (!deleted) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.json({ message: `✅ ${name} deleted successfully` });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ error: "Failed to delete country" });
  }
};

module.exports.getSummaryImage = async (req, res) => {
  try {
    const imagePath = path.join(__dirname, "../../cache/summary.png");

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: "Summary image not found" });
    }

    res.setHeader("Content-Type", "image/png");
    res.sendFile(imagePath);
  } catch (error) {
    console.error("❌ Error serving summary image:", error);
    res.status(500).json({ error: "Failed to load summary image" });
  }
};