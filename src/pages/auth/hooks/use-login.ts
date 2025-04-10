import {
  authApi,
  LoginRequest,
  LoginWithGoogleRequest,
  TokenResponse,
} from "@/api/auth-api";
import { ApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/common";

export const useLogin = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation<
    ApiResponse<TokenResponse>,
    AxiosError<{ message?: string }>,
    LoginRequest
  >({
    mutationFn: async (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      localStorage.setItem(ACCESS_TOKEN, data.data.access_token);
      localStorage.setItem(REFRESH_TOKEN, data.data.refresh_token);
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed!");
    },
  });

  return loginMutation;
};

export const useLoginWithGoogle = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation<
    ApiResponse<TokenResponse>,
    AxiosError<{ message?: string }>,
    LoginWithGoogleRequest
  >({
    mutationFn: async (data: LoginWithGoogleRequest) =>
      authApi.loginWithGoogle(data),
    onSuccess: (data) => {
      localStorage.setItem(ACCESS_TOKEN, data.data.access_token);
      localStorage.setItem(REFRESH_TOKEN, data.data.refresh_token);
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed!");
    },
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      const loginData: LoginWithGoogleRequest = {
        access_token: codeResponse.access_token,
      };
      loginMutation.mutate(loginData);
    },
    onError: (error) => {
      console.log("Google login failed:", error);
      alert("Google login failed. Please try again.");
    },
  });

  return handleGoogleLogin;
};
