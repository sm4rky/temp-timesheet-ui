import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const http: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("HTTP Error:", error.message);
    return Promise.reject(error);
  }
);

export default http;
