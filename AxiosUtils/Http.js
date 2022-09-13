import axios from "axios";

export const defaultGet = (url) => axios.get(url).then(response => response).catch(error => error);