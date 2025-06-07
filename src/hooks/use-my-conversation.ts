import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import {
  conversationApi,
  ConversationInfoResponse,
  ConversationQueryParams,
} from "@/api/conversation-api";

export const useMyConversation = (
  params: ConversationQueryParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ConversationInfoResponse[]>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ConversationInfoResponse[]>>({
    ...options,
    queryKey: ["my-conversations", params],
    queryFn: () => conversationApi.getMyConversation(params),
  });
};