import uuidv4 from "uuid4";
import crypto from "crypto";
import { encode as queryEncode } from "querystring";
import jwt from "jsonwebtoken";
const { sign } = jwt;

/**
 * Upbit Private 요청인 경우 사용
 * @param {object} token
 * @param {string} token.access_key
 * @param {string} token.secret_key
 * @returns
 */
export const upbitConfig = (token) => {
  const payload = {
    access_key: token.access_key,
    nonce: uuidv4(),
  };

  const config = {
    baseURL: "https://api.upbit.com",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${sign(payload, token.secret_key)}`,
    },
  };

  return config;
};

// TODO: DELETE
import axios from "axios";
import fs from "fs";

// TODO: Delete
const env = JSON.parse(fs.readFileSync("./env.json"));
const access_key = env.UPBIT_OPEN_API_ACCESS_KEY;
const secret_key = env.UPBIT_OPEN_API_SECRET_KEY;

const token = {
  access_key: access_key,
  secret_key: secret_key,
};
// #1
// const instance = axios.create(upbitConfig(token));

async function apitest() {
  console.log("TEST API REQUEST");
  // #1
  //   const data = await instance.get("/v1/accounts");

  // #2
  // 응답 스키마
  await axios.get("/v1/api_keys", upbitConfig(token)).then(function (response) {
    console.log("data: ", response.data);
    console.log("status: ", response.status);
    console.log("statusText: ", response.statusText);
    console.log("headers: ", response.headers);
    // console.log('config: ',response.config);
  });
}

// apitest();
