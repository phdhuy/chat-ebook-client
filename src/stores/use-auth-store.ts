import { create } from "zustand";
import { useCallback } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/common";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const initializeState = (): AuthState => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  const isAuthenticated = !!(accessToken && refreshToken);

  return {
    isAuthenticated,
    accessToken,
    refreshToken,
  };
};

export const useAuthStore = create<AuthState>(() => initializeState());

export const useAuthActions = () => {
  const set = useAuthStore.setState;

  const signIn = useCallback(
    (accessToken: string, refreshToken: string) => {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
      set({
        isAuthenticated: true,
        accessToken,
        refreshToken,
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
    });
  }, [set]);

  return { signIn, signOut };
};
