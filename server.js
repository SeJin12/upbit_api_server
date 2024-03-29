import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import request from "request";
import * as uuid4 from "uuid4";
import * as jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import { encode as queryEncode } from "querystring";

import { MinuteCandle } from "./schema/minuteCandle.js";
import { Find } from "./database.js";
import { Market } from "./schema/market.js";
import { Ticker } from "./schema/ticker.js";

// Exec batch schedule
import * as batch from "./batch.js";

const uuidv4 = uuid4.uuidv4;
const sign = jsonwebtoken.sign;
const server_url = "https://api.upbit.com";

// Server
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ credentials: true, origin: "*" }));

app.get("/", function (req, res) {
  res.send("upbit API Server!");
});

/*
    전체 계좌 조회
    내가 보유한 자산 리스트를 보여줍니다.
*/
app.get("/v1/accounts", function (req, res) {
  console.log(req.url + ", TIME : " + new Date());
  const { access_key, secret_key } = req.headers;

  const payload = {
    access_key: access_key,
    nonce: uuidv4(),
  };

  let options = {
    method: "GET",
    url: server_url + "/v1/accounts",
    headers: { Authorization: `Bearer ${sign(payload, secret_key)}` },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    let statusCode = response.statusCode;
    console.log(statusCode);
    res.send(JSON.parse(body));
  });
});

/*
    API 키 리스트 조회
    API 키 목록 및 만료 일자를 조회합니다.
*/
app.get("/v1/api_keys", function (req, res) {
  console.log(req.url + ", TIME : " + new Date());
  const { access_key, secret_key } = req.headers;

  const payload = {
    access_key: access_key,
    nonce: uuidv4(),
  };

  let options = {
    method: "GET",
    url: server_url + "/v1/api_keys",
    headers: { Authorization: `Bearer ${sign(payload, secret_key)}` },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    let statusCode = response.statusCode;
    console.log(statusCode);
    res.send(JSON.parse(body));
  });
});

/*
    출금 리스트 조회
    currency, uuids, txids, limit, page, order_by
    출금 상태 (state)
        - submitting : 처리 중
        - submitted : 처리 완료
        - almost_accepted : 출금대기중
        - rejected : 거부
        - accepted : 승인됨
        - processing : 처리 중
        - done : 완료
        - canceled : 취소됨
*/
app.post("/v1/withdraws", function (req, res) {
  console.log(req.url + ", TIME : " + new Date());
  const { access_key, secret_key } = req.headers;

  const currency = req.body.currency;
  const state = req.body.state;
  const txids = [];

  const non_array_body = {
    currency: currency,
    state: state,
  };
  const array_body = {
    txids: txids,
  };
  const body = {
    ...non_array_body,
    ...array_body,
  };

  const txid_query = txids.map((txid) => `txids[]=${txid}`).join("&");
  const query = queryEncode(non_array_body) + "&" + txid_query;

  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");

  const payload = {
    access_key: access_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  let options = {
    method: "GET",
    url: server_url + "/v1/withdraws?" + query,
    headers: {
      Authorization: `Bearer ${sign(payload, secret_key)}`,
      json: body,
    },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    let statusCode = response.statusCode;
    console.log(statusCode);
    res.send(JSON.parse(body));
  });
});

/*
    입금 리스트 조회
    currency, uuids, txids, limit, page, order_by(asc/desc)
    입금 상태 (state)
        - submitting : 처리 중
        - submitted : 처리완료
        - almost_accepted : 입금 대기 중
        - rejected : 거절
        - accepted : 승인됨
        - processing : 처리 중
*/
app.post("/v1/deposits", function (req, res) {
  console.log(req.url + ", TIME : " + new Date());
  const { access_key, secret_key } = req.headers;

  const currency = req.body.currency;
  const state = req.body.state;
  const txids = [];

  const non_array_body = {
    currency: currency,
    state: state,
  };
  const array_body = {
    txids: txids,
  };
  const body = {
    ...non_array_body,
    ...array_body,
  };

  const txid_query = txids.map((txid) => `txids[]=${txid}`).join("&");
  const query = queryEncode(non_array_body) + "&" + txid_query;

  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");

  const payload = {
    access_key: access_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  let options = {
    method: "GET",
    url: server_url + "/v1/deposits?" + query,
    headers: {
      Authorization: `Bearer ${sign(payload, secret_key)}`,
      json: body,
    },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    let statusCode = response.statusCode;
    console.log(statusCode);
    res.send(JSON.parse(body));
  });
});

/*
    입출금 현황
    입출금 현황 및 블록 상태를 조회합니다.
*/
app.get("/v1/status/wallet", function (req, res) {
  console.log(req.url + ", TIME : " + new Date());
  const { access_key, secret_key } = req.headers;

  const payload = {
    access_key: access_key,
    nonce: uuidv4(),
  };

  let options = {
    method: "GET",
    url: server_url + "/v1/status/wallet",
    headers: { Authorization: `Bearer ${sign(payload, secret_key)}` },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    let statusCode = response.statusCode;
    console.log(statusCode);
    res.send(JSON.parse(body));
  });
});

/*
    Quitation API
*/

/*
    마켓 코드 조회
    업비트에서 거래 가능한 마켓 목록
*/
app.get("/v1/market/all", async function (req, res) {
  console.log(req.url + ", TIME : " + new Date());
  const markets = await Find(Market);
  res.send(markets);
});

/*
    현재가 정보
*/
app.get("/v1/ticker/:market", async function (req, res) {
  console.log(req.url + ", TIME : " + new Date());
  const data = await Find(Ticker, { market: req.params.market }, 1);
  res.send(data);
});

/*
    분(Minute) 캔들
*/
app.get("/v1/candles/minutes/:unit/:market/:count", async function (req, res) {
  console.log(req.url + ", TIME : " + new Date());
  const data = await Find(MinuteCandle, { market: req.params.market }, 1);
  res.send(data);
});

/*
    일(Day) 캔들
*/
app.get("/v1/candles/days/:market/:count", function (req, res) {
  console.log(req.url + ", TIME : " + new Date());

  let options = {
    method: "GET",
    url:
      server_url +
      "/v1/candles/days" +
      "?market=" +
      req.params.market +
      "&count=" +
      req.params.count,
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    let statusCode = response.statusCode;
    console.log(statusCode);
    res.send(JSON.parse(body));
  });
});

/*
    주(Week) 캔들
*/
app.get("/v1/candles/weeks/:market/:count", function (req, res) {
  console.log(req.url + ", TIME : " + new Date());

  let options = {
    method: "GET",
    url:
      server_url +
      "/v1/candles/weeks" +
      "?market=" +
      req.params.market +
      "&count=" +
      req.params.count,
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    let statusCode = response.statusCode;
    console.log(statusCode);
    res.send(JSON.parse(body));
  });
});

/*
    월(Month) 캔들
*/
app.get("/v1/candles/months/:market/:count", function (req, res) {
  console.log(req.url + ", TIME : " + new Date());

  let options = {
    method: "GET",
    url:
      server_url +
      "/v1/candles/months" +
      "?market=" +
      req.params.market +
      "&count=" +
      req.params.count,
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    let statusCode = response.statusCode;
    console.log(statusCode);
    res.send(JSON.parse(body));
  });
});

/*
    주문(Order)
*/
/*
    주문하기
    주문 요청을 한다.
*/
app.post("/v1/orders", function (req, res) {
  console.log(req.url + ", TIME : " + new Date());
  const { access_key, secret_key } = req.headers;
  const body = {
    market: "KRW-BTC",
    side: "ask",
    volume: "0.005",
    price: "70000000",
    ord_type: "limit",
  };

  const query = queryEncode(body);

  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");

  const payload = {
    access_key: access_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign(payload, secret_key);

  const options = {
    method: "POST",
    url: server_url + "/v1/orders",
    headers: { Authorization: `Bearer ${token}` },
    json: body,
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    let statusCode = response.statusCode;
    res.send(response.body);
  });
});

app.listen(8000, function () {
  console.log("start! node server");
});
