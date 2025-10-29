const axios = require("axios");
const Country = require("../models/Country");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

async function refreshCountries() {
  try {
    // 1️⃣ Fetch all countries
    const countryRes = await axios.get(
      "https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies"
    );
    const countries = countryRes.data;

    // 2️⃣ Fetch exchange rates (base = USD)
    const rateRes = await axios.get("https://open.er-api.com/v6/latest/USD");
    const rates = rateRes.data.rates;

    if (!countries || !rates) {
      throw new Error("External API data unavailable");
    }

    const updatedCountries = [];

    // 3️⃣ Process each country
    for (const c of countries) {
      const name = c.name;
      const capital = c.capital || null;
      const region = c.region || null;
      const population = c.population || 0;
      const flag_url = c.flag || null;

      // Handle currency
      let currency_code = null;
      let exchange_rate = null;
      let estimated_gdp = 0;

      if (c.currencies && c.currencies.length > 0) {
        currency_code = c.currencies[0].code || null;
      }

      if (currency_code && rates[currency_code]) {
        exchange_rate = rates[currency_code];

        // random multiplier between 1000 and 2000
        const multiplier = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
        estimated_gdp = (population * multiplier) / exchange_rate;
      }

      // 4️⃣ Upsert into database (update or create)
      const existing = await Country.findOne({
        where: { name: { [Op.like]: name } }, // case-insensitive
      });

      if (existing) {
        await existing.update({
          capital,
          region,
          population,
          currency_code,
          exchange_rate,
          estimated_gdp,
          flag_url,
          last_refreshed_at: new Date(),
        });
      } else {
        await Country.create({
          name,
          capital,
          region,
          population,
          currency_code,
          exchange_rate,
          estimated_gdp,
          flag_url,
          last_refreshed_at: new Date(),
        });
      }

      updatedCountries.push(name);
    }

      await generateSummaryImage();
    // ✅ Return summary
    return {
      message: "Countries refreshed successfully",
      total: updatedCountries.length,
      timestamp: new Date(),
    };
  } catch (err) {
    if (err.response?.status >= 500) {
      throw {
        status: 503,
        error: "External data source unavailable",
        details: err.message,
      };
    }
    throw err;
  }
}

async function getCountries({ region, currency, sort }) {
  const where = {};
  const order = [];

  // Filter by region
  if (region) {
    where.region = { [Op.like]: region };
  }

  // Filter by currency
  if (currency) {
    where.currency_code = { [Op.like]: currency };
  }

  // Sort by estimated_gdp ascending or descending
  if (sort) {
    if (sort === "gdp_desc") order.push(["estimated_gdp", "DESC"]);
    else if (sort === "gdp_asc") order.push(["estimated_gdp", "ASC"]);
  }

  const countries = await Country.findAll({
    where,
    order,
  });

  return countries;
};

async function getCountryByName(name) {
  const country = await Country.findOne({
    where: { name: { [Op.like]: name } },
  });
  return country;
}

async function deleteCountryByName(name) {
  const deleted = await Country.destroy({
    where: { name: { [Op.like]: name } },
  });
  return deleted;
}

async function generateSummaryImage() {
  try {
    const totalCountries = await Country.count();
    const top5 = await Country.findAll({
      order: [["estimated_gdp", "DESC"]],
      limit: 5,
    });
    const lastRefreshed = await Country.max("last_refreshed_at");

    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.fillText("🌍 Country Summary", 40, 60);

    // Info text
    ctx.font = "20px Arial";
    ctx.fillText(`Total Countries: ${totalCountries}`, 40, 120);
    ctx.fillText(`Last Refreshed: ${lastRefreshed || "N/A"}`, 40, 160);

    // Top 5 Countries by GDP
    ctx.fillText("Top 5 by Estimated GDP:", 40, 220);
    ctx.font = "18px Arial";
    top5.forEach((c, i) => {
      ctx.fillText(
        `${i + 1}. ${c.name} - ${c.estimated_gdp.toLocaleString()}`,
        60,
        260 + i * 25
      );
    });

    // Save the image
    const outputDir = path.join(__dirname, "../../cache");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const outPath = path.join(outputDir, "summary.png");
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outPath, buffer);

    console.log("✅ Summary image generated:", outPath);
  } catch (error) {
    console.error("❌ Error generating summary image:", error);
  }
}

module.exports = {
  refreshCountries,
  getCountries,
  getCountryByName,
  deleteCountryByName,
  generateSummaryImage,
};
