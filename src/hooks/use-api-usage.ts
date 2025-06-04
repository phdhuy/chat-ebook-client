import { ApiUsageResponse, userApi } from "@/api/user-api";
import { ApiResponse } from "@/types/api";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export const useApiUsage = (
  options?: Omit<
    UseQueryOptions<ApiResponse<ApiUsageResponse>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ApiUsageResponse>, Error>({
    ...options,
    queryKey: ["api-usage"],
    queryFn: () => userApi.countApiUsage(),
  });
};
