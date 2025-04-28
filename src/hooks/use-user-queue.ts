import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { QueueInfoResponse, userApi } from "@/api/user-api";

export const useUserQueue = (
  options?: UseMutationOptions<ApiResponse<QueueInfoResponse>, Error>
) => {
  return useMutation<ApiResponse<QueueInfoResponse>, Error>({
    mutationFn: () => userApi.createQueue(),
    ...options,
  });
};
