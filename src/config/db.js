const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DATABASE_URL) {
  // ✅ Railway (or any hosted) environment
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // important for Railway’s SSL
      },
    },
    logging: false,
  });
} else {
  // ✅ Local development (using .env)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      logging: false,
    }
  );
}

module.exports = sequelize;
