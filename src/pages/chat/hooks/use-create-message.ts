import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { CreateMessageRequest, messageApi } from "@/api/message-api";

export const useCreateMessage = (
  options?: UseMutationOptions<
    ApiResponse<void>,
    Error,
    { conversationId: string; body: CreateMessageRequest }
  >
) => {

  return useMutation<
    ApiResponse<void>,
    Error,
    { conversationId: string; body: CreateMessageRequest }
  >({
    mutationFn: ({ conversationId, body }) =>
      messageApi.createMessage(conversationId, body),
    ...options,
  });
};
