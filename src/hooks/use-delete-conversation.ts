import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ApiResponse } from "@/types/api"
import { conversationApi } from "@/api/conversation-api"
import { useNavigate } from "react-router-dom"

export const useDeleteConversation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (conversationId: string): Promise<ApiResponse<void>> => {
      return conversationApi.deleteConversation(conversationId)
    },
    onSuccess: (_data, conversationId) => {
      queryClient.refetchQueries({ queryKey: ["my-conversations"] });

      const currentPath = window.location.pathname
      if (currentPath === `/chat/${conversationId}`) {
        navigate("/")
      }
    },
  })
}