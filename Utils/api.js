import axios from "axios";
import fs from "fs";

const upbit = axios.create({
  baseURL: "https://api.upbit.com",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

export const upbitGet = (url) =>
  upbit
    .get(url)
    .then((response) => response.data)
    .catch((error) => error);


export const defaultGet = (url) =>
  axios
    .get(url)
    .then((response) => response)
    .catch((error) => error);

    
export const headersGet = (url, config) =>
  axios
    .get(url, config)
    .then((response) => response)
    .catch((error) => error);

// https://axios-http.com/kr/docs/api_intro
export const getImage = (url) =>
  axios
    .get(url, { responseType: "stream" })
    .then(function (response) {
      response.data.pipe(fs.createWriteStream("ada_lovelace.jpg")); // 수정 필요
    })
    .catch((error) => error);
