import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { conversationApi, ConversationInfoResponse } from "@/api/conversation-api";


export const useMyConversation = (
  options?: Omit<
    UseQueryOptions<ApiResponse<ConversationInfoResponse[]>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ConversationInfoResponse[]>>({
    ...options,
    queryKey: ["my-conversations"],
    queryFn: () => conversationApi.getMyConversation(),
  });
};