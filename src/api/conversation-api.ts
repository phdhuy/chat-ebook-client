import { ApiResponse } from "@/types/api";
import api from "./config";

export type FileInfoResponse = {
  id: string;
  created_at: number;
  secure_url: string;
  public_id: string;
  format: string;
  pages: number;
  bytes: number;
};

export type ConversationInfoResponse = {
  id: string;
  created_at: number;
  name: string;
  file: FileInfoResponse;
};

export const conversationApi = {
    getMyConversation: async (): Promise<ApiResponse<ConversationInfoResponse[]>> => {
      const response = await api.get("/v1/conversations");
      return response.data;
  },

    getDetailConversation: async (conversationId: string): Promise<ApiResponse<ConversationInfoResponse>> => {
      const response = await api.get(`/v1/conversations/${conversationId}`);
      return response.data;
    },

    createConversation: async (file: File): Promise<ApiResponse<ConversationInfoResponse>> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post("/v1/conversations", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      },
  };