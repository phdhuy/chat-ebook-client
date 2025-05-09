import { authApi, RegisterRequest, RegisterResponse } from "@/api/auth-api";
import { ApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/types/exception";

export const useRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<RegisterResponse>,
    AxiosError<ApiError>,
    RegisterRequest
  >({
    mutationFn: (data) => authApi.register(data),
    onSuccess: () => {
      toast({
        title: "Welcome aboard! 🎉",
        description: "Your account has been created successfully.",
      });
      navigate("/sign-in");
    },
    onError: (err) => {
      const message =
        err.response?.data.error.message ||
        "Something went wrong. Please try again.";

      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: message,
      });
      console.error("Registration error:", err);
    },
  });
};