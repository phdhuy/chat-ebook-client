import { authApi, RegisterRequest, RegisterResponse } from "@/api/auth-api";
import { ApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigate = useNavigate();

  const registerMutation = useMutation<
    ApiResponse<RegisterResponse>,
    AxiosError<{ message?: string }>,
    RegisterRequest
  >({
    mutationFn: async (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      console.log("User Registered:", data);
      navigate("/sign-in");
    },
    onError: (error) => {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Registration failed!");
    },
  });

  return registerMutation;
};
