import { ROLE_STORAGE_KEY } from "@/contexts/RoleContext";
import axios from "axios";
import { parseApiError, ApiError } from "./error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem(ROLE_STORAGE_KEY) || "admin";
      config.headers["x-role"] = role;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const parsed = parseApiError(error);
    return Promise.reject(new ApiError(parsed));
  },
);

export default api;
