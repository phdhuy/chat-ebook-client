import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import {
  conversationApi,
  ConversationInfoResponse,
} from "@/api/conversation-api";
import { UpdateConversationRequest } from "../api/conversation-api";

export const useUpdateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: string;
      data: UpdateConversationRequest;
    }): Promise<ApiResponse<ConversationInfoResponse>> => {
      return conversationApi.updateConversation(conversationId, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-conversations"] });

      if (data?.data?.id) {
        queryClient.setQueryData(["conversation", data.data.id], data);
      }
    },
  });
};
