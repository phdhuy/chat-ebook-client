import { useAuthStore } from "@/stores/use-auth-store";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/common";
import axios from "axios";

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_ENDPOINT || "",
  headers: { "Content-Type": "application/json" },
});

export const refreshToken = async () => {
  const { refreshToken: currentRefreshToken } = useAuthStore.getState();
  if (!currentRefreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await refreshApi.post("/v1/auth/refresh-token", {
      refresh_token: currentRefreshToken,
    });

    const newAccessToken = response.data.data.access_token;
    const newRefreshToken = response.data.data.refresh_token;

    localStorage.setItem(ACCESS_TOKEN, newAccessToken);
    localStorage.setItem(REFRESH_TOKEN, newRefreshToken);

    useAuthStore.setState({
      isAuthenticated: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    useAuthStore.setState({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
    });
    window.location.href = "/sign-in";
    throw error;
  }
};