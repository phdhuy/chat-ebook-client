import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { mindMapApi, MindMapInfoResponse } from "@/api/mindmap-api";

export const useMindMapEbook = (
  options?: UseMutationOptions<
    ApiResponse<MindMapInfoResponse>,
    Error,
    { conversationId: string }
  >
) => {
  return useMutation<
    ApiResponse<MindMapInfoResponse>,
    Error,
    { conversationId: string }
  >({
    mutationFn: ({ conversationId }) =>
      mindMapApi.generateMindMap(conversationId),
    ...options,
  });
};
