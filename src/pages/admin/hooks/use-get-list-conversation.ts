import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { adminApi, AdminQueryParams, ConversationInfoResponse } from "@/api/admin-api";

export const useGetListConversation = (
  params: AdminQueryParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ConversationInfoResponse[]>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ConversationInfoResponse[]>>({
    ...options,
    queryKey: ["admin-conversations", params],
    queryFn: () => adminApi.getListConversation(params),
  });
};
