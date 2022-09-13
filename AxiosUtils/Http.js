// import axios from "axios";
const { default: axios } = require("axios");

const defaultGet = (url) => axios.get(url).then(response => response).catch(error => error);


module.exports = {
    defaultGet,
  };
  