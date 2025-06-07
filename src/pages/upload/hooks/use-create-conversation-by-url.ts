import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import {
  conversationApi,
  ConversationInfoResponse,
  CreateConversationByUrlRequest,
} from "@/api/conversation-api";

export const useCreateConversationByUrl = (
  options?: UseMutationOptions<
    ApiResponse<ConversationInfoResponse>,
    Error,
    CreateConversationByUrlRequest>) => {
  return useMutation({
    mutationFn: (body: CreateConversationByUrlRequest) =>
      conversationApi.createConversationByUrl(body),
    ...options,
  });
};
