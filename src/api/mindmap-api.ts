import { ApiResponse } from "@/types/api";
import api from "./config";

export type MindMapInfoResponse = {
  id: string;
  conversation_id: string;
  payload?: any;
};

export const mindMapApi = {
  generateMindMap: async (
    conversationId: string
  ): Promise<ApiResponse<MindMapInfoResponse>> => {
    const response = await api.post(
      `/v1/conversations/${conversationId}/mindmaps`
    );
    return response.data;
  },

  getMindMapByConversation: async (
    conversationId: string
  ): Promise<ApiResponse<MindMapInfoResponse>> => {
    const response = await api.get(
      `/v1/conversations/${conversationId}/mindmaps`
    );
    return response.data;
  },
};