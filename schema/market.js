import mongoose from "mongoose";
const { Schema } = mongoose;

const market = new Schema({
  market: "string",
  korean_name: "string",
  english_name: "string",
  market_warning: "string",
});

export const Market = mongoose.model("markets", market);
