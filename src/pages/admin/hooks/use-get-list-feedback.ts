import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { adminApi, AdminQueryParams, FeedbackResponse } from "@/api/admin-api";

export const useGetListFeedback = (
  params: AdminQueryParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<FeedbackResponse[]>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<FeedbackResponse[]>>({
    ...options,
    queryKey: ["admin-feedbacks", params],
    queryFn: () => adminApi.getListFeedback(params),
  });
};