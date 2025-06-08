import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { adminApi, AdminQueryParams, UserInfoResponse } from "@/api/admin-api";

export const useGetListUser = (
  params: AdminQueryParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<UserInfoResponse[]>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<UserInfoResponse[]>>({
    ...options,
    queryKey: ["admin-users", params],
    queryFn: () => adminApi.getListUser(params),
  });
};