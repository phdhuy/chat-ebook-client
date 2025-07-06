import { useAuthStore } from "@/stores/use-auth-store";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/common";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_ENDPOINT || "",
  headers: { "Content-Type": "application/json" },
});

interface DecodedToken {
  exp: number;
  role: string;
}

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime + 300;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return false;
  }
};

export const areTokensValid = (): boolean => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);

  return isTokenValid(accessToken) && !!refreshToken;
};

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
