const mongoose = require("mongoose");
const { Schema } = mongoose;

const minuteCandle = new Schema({
  market: "string",
  candle_date_time_utc: "string",
  candle_date_time_kst: "string",
  opening_price: "string",
  high_price: "string",
  low_price: "string",
  trade_price: "string",
  timestamp: "string",
  candle_acc_trade_price: "string",
  candle_acc_trade_volume: "string",
  unit: "string",
  registerDate: "Date",
});

// candle 1분봉
const MinuteCandle = mongoose.model("candles1", minuteCandle);

module.exports = {
  MinuteCandle,
};
