import { create } from "zustand";
import { useCallback } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/common";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
}

interface DecodedToken {
  role: string;
}

const decodeToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const initializeState = (): AuthState => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  const isAuthenticated = !!(accessToken && refreshToken);
  const role = decodeToken(accessToken);

  return {
    isAuthenticated,
    accessToken,
    refreshToken,
    role,
  };
};

export const useAuthStore = create<AuthState>(() => initializeState());

export const useAuthActions = () => {
  const set = useAuthStore.setState;
  const navigate = useNavigate();

  const signIn = useCallback(
    (accessToken: string, refreshToken: string) => {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
      const role = decodeToken(accessToken);
      set({
        isAuthenticated: true,
        accessToken,
        refreshToken,
        role,
      });
    },
    [set]
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);

    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      role: null,
    });

    navigate("/sign-in");
  }, [set, navigate]);

  return { signIn, signOut };
};
