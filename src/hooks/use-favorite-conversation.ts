import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { conversationApi } from "@/api/conversation-api";

export const useFavoriteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
    }: {
      conversationId: string;
    }): Promise<ApiResponse<void>> => {
      return conversationApi.favoriteConversation(conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-conversations"] });
    },
  });
};
