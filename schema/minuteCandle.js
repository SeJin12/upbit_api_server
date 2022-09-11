const mongoose = require('mongoose');

const minuteCandle = mongoose.Schema({
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
    registerDate: "Date"
})

module.exports = {
    minuteCandle
}