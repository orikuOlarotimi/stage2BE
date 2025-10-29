const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Country = sequelize.define("Country", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capital: DataTypes.STRING,
  region: DataTypes.STRING,
  population: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  currency_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  exchange_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  estimated_gdp: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: true,
  },
  flag_url: DataTypes.STRING,
  last_refreshed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Country;
