const mongoose = require("mongoose");
const { market } = require("./schema/market");
const { minuteCandle } = require("./schema/minuteCandle");

mongoose.connect("mongodb://127.0.0.1:27017/project");

const db = mongoose.connection;

db.on("error", function () {
  console.log("Connection Failed!");
});

// db.on("open", function () {
//   console.log("Connected");
// });

// Markets
const Market = mongoose.model("markets", market);

const insertMarket = (data) => {
  for (value in data) {
    new Market(data[value]).save(function (error, data) {
      if (error) {
        console.log("failed insertMarket.", data);
      } else {
        console.log("Success insertMarket.", data);
      }
    });
  }
};

const findMarket = async () => {
  return await Market.find(function (error, data) {
    if (error) {
      return error;
    } else {
      return data;
    }
  }).clone();
};

const deleteAllMarkets = async () => {
  return await Market.deleteMany();
};

// candle 1
const MinuteCandle = mongoose.model("candles1", minuteCandle);

const insertMinuteCandle = (data) => {
  for (value in data) {
    new MinuteCandle(data[value]).save(function (error, data) {
      if (error) {
        // console.log("failed insertMinuteCandle.", data);
      } else {
        // console.log("Success insertMinuteCandle.", data);
      }
    });
  }
};

const findCandleMarket = async (filter) => {
  return await MinuteCandle.find(filter)
    .sort({ _id: -1 })
    .limit(1)
    .then((res) => res)
    .catch((e) => e);
};

module.exports = {
  insertMarket,
  findMarket,
  deleteAllMarkets,
  insertMinuteCandle,
  findCandleMarket,
};
