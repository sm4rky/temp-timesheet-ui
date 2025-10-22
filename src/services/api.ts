import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { getUserEmail } from "@/services/user";

const http: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});


try {
  http.defaults.headers.common["X-User-Email"] = getUserEmail();
} catch {
}


http.interceptors.request.use((config) => {
  const email = getUserEmail();
  config.headers = config.headers ?? {};
  (config.headers as Record<string, string>)["X-User-Email"] = email;

  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("HTTP Error:", error.message);
    return Promise.reject(error);
  }
);

export default http;
