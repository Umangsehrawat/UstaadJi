import axios from "axios";

const api = axios.create({
  baseURL: "http://https://ustaadji-backend.onrender.com/api",
});

export default api;