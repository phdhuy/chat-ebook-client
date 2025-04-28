import { ApiResponse } from "@/types/api";
import api from "./config";

export type MessageQueryParams = {
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  paging?: number;
};

export type MessageInfoResponse = {
  id: number;
  created_at: number;
  content: string;
  sender_type: string;
  conversation_id: string;
};

export type CreateMessageRequest = {
  content: string;
};

export const messageApi = {
  getListMessageInConversation: async (
    conversationId: string,
    params: MessageQueryParams
  ): Promise<ApiResponse<MessageInfoResponse[]>> => {
    const response = await api.get(
      `/v1/conversations/${conversationId}/messages`,
      { params }
    );
    return response.data;
  },

  createMessage: async (
    conversationId: string,
    body: CreateMessageRequest
  ): Promise<ApiResponse<void>> => {
    const response = await api.post(
      `/v1/conversations/${conversationId}/messages`,
      body
    );
    return response.data;
  },
};
