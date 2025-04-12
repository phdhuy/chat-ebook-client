import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { conversationApi, ConversationInfoResponse } from "@/api/conversation-api";

export const useConversationDetail = (
  conversationId: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<ConversationInfoResponse>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ConversationInfoResponse>>({
    ...options,
    queryKey: ["conversationDetail", conversationId],
    queryFn: () => conversationApi.getDetailConversation(conversationId),
  });
};