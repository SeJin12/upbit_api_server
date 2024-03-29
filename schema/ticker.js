import mongoose from "mongoose";
const { Schema } = mongoose;

const ticker = new Schema({
  market: String,
  trade_date: String,
  trade_time: String,
  trade_date_kst: String,
  trade_time_kst: String,
  trade_timestamp: Date,
  opening_price: Number,
  high_price: Number,
  low_price: Number,
  trade_price: Number,
  prev_closing_price: Number,
  change: String,
  change_price: Number,
  change_rate: Number,
  signed_change_price: Number,
  signed_change_rate: Number,
  trade_volume: Number,
  acc_trade_price: Number,
  acc_trade_price_24h: Number,
  acc_trade_volume: Number,
  acc_trade_volume_24h: Number,
  highest_52_week_price: Number,
  highest_52_week_date: String,
  lowest_52_week_price: Number,
  lowest_52_week_date: String,
});

export const Ticker = mongoose.model("tickers", ticker);
