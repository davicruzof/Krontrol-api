import axios from "axios";

const BASE_URL = "https://datalbus.com.br:8000/api/v2";

const api = axios.create({
  baseURL: BASE_URL, // Replace this with your server URL
});

export default api;
