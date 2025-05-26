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
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/types/exception";
import { useAuthActions } from "@/stores/use-auth-store";

export const useLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<TokenResponse>,
    AxiosError<ApiError>,
    LoginRequest
  >({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (res) => {
      signIn(res.data.access_token, res.data.refresh_token);
      toast({
        title: "Welcome back! 🎉",
        description: "You’ve successfully signed in.",
      });
      navigate("/");
    },
    onError: (err) => {
      const message =
        err.response?.data.error.message || "Login failed. Please try again.";

      toast({
        variant: "destructive",
        title: "Login Error",
        description: message,
      });
      console.error("Login failed:", err);
    },
  });
};

export const useLoginWithGoogle = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const { toast } = useToast();

  const loginMutation = useMutation<
    ApiResponse<TokenResponse>,
    AxiosError<ApiError>,
    LoginWithGoogleRequest
  >({
    mutationFn: (data) => authApi.loginWithGoogle(data),
    onSuccess: (res) => {
      signIn(res.data.access_token, res.data.refresh_token);
      toast({
        title: "Google Sign-In Success! 🎉",
        description: "You’re now logged in.",
      });
      navigate("/");
    },
    onError: (err) => {
      const message =
        err.response?.data.error.message ||
        "Google login failed. Please try again.";

      toast({
        variant: "destructive",
        title: "Google Login Error",
        description: message,
      });
      console.error("Google login failed:", err);
    },
  });

  return useGoogleLogin({
    onSuccess: (codeResponse) => {
      loginMutation.mutate({ access_token: codeResponse.access_token });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Google OAuth Error",
        description: "Could not complete Google sign-in.",
      });
      console.error("Google OAuth failed:", error);
    },
  });
};