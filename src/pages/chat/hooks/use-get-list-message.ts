import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import {
  messageApi,
  MessageInfoResponse,
  MessageQueryParams,
} from "@/api/message-api";

export const useGetListMessage = (
  params: MessageQueryParams,
  conversationId: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<MessageInfoResponse[]>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<MessageInfoResponse[]>>({
    ...options,
    queryKey: ["messages", conversationId, params],
    queryFn: () =>
      messageApi.getListMessageInConversation(conversationId, params),
  });
};