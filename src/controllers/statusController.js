const Country = require("../models/Country");

exports.getStatus = async (req, res) => {
  try {
    // Count all countries
    const totalCountries = await Country.count();

    // Find the most recent refresh timestamp
    const lastRefreshed = await Country.max("last_refreshed_at");

    res.json({
      total_countries: totalCountries,
      last_refreshed_at: lastRefreshed || "No data yet"
    });
  } catch (error) {
    console.error("❌ Status error:", error);
    res.status(500).json({
      error: "Failed to get status",
      timestamp: new Date().toISOString(),
    });
  }
};
