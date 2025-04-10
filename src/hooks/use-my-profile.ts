import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { userApi, UserInfoResponse } from "@/api/user-api";


export const useMyProfile = (
  options?: Omit<
    UseQueryOptions<ApiResponse<UserInfoResponse>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<UserInfoResponse>>({
    ...options,
    queryKey: ["my-profile"],
    queryFn: () => userApi.getMyProfile(),
  });
};
