import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import {
  conversationApi,
  ConversationInfoResponse,
} from "@/api/conversation-api";

export const useCreateConversation = (
  options?: UseMutationOptions<
    ApiResponse<ConversationInfoResponse>,
    Error,
    File
  >
) => {
  return useMutation({
    mutationFn: (file: File) => conversationApi.createConversation(file),
    ...options,
  });
};
