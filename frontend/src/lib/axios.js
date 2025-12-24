import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:8080/api"
    : import.meta.env.VITE_API_URL,   // <- use the VITE_API_URL here
  withCredentials: true,
});
