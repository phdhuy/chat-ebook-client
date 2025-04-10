import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/common";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_ENDPOINT || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await api.post("/v1/auth/refresh-token", {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data.data.access_token;

    localStorage.setItem(ACCESS_TOKEN, newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    window.location.href = "/sign-in";
    return null;
  }
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("VAO DAY NE");


    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      localStorage.removeItem(ACCESS_TOKEN);
      window.location.href = "/sign-in";
      return Promise.reject(error);
    }

    if (
      error.response.status === 403 &&
      error.response.data?.error?.code === "ERR.TOK0105" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      const newToken = await refreshToken();
      isRefreshing = false;

      if (newToken) {
        onRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;