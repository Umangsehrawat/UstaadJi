import axios from "axios";

const api = axios.create({
  baseURL: "https://ustaadji-backend.onrender.com/api",
});

export default api;