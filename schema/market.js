const mongoose = require("mongoose");
const { Schema } = mongoose;

const market = new Schema({
  market: "string",
  korean_name: "string",
  english_name: "string",
  market_warning: "string",
});

const Market = mongoose.model("markets", market);

module.exports = {
  Market,
};
