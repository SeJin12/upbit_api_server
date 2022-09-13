import mongoose from "mongoose";
const { Schema } = mongoose;

const asset = new Schema({
  userid: String, // 유저 ID
  currency: String, // 화폐를 의미하는 영문 대문자 코드
  balance: String, // 주문가능 금액/수량
  locked: String, // 주문 중 묶여있는 금액/수량
  avg_buy_price: String, //매수평균가
  avg_buy_price_modified: Boolean, // 매수평균가 수정 여부
  unit_currency: String, // 평단가 기준 화폐
});

export const Asset = mongoose.model("Assets", asset);