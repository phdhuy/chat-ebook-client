import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { authApi, RefreshTokenRequest } from "@/api/auth-api";

export const useRevokeToken = (
  options?: UseMutationOptions<ApiResponse<void>, Error, RefreshTokenRequest>
) => {
  return useMutation({
    mutationFn: (refreshToken: RefreshTokenRequest) =>
      authApi.revoketoken(refreshToken),
    ...options,
  });
};
