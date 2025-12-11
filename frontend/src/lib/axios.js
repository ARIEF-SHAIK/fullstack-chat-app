import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "fullstack-chat-app-2ird.vercel.app",
  withCredentials: true,
});