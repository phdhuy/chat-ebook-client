import { ApiResponse } from "@/types/api";
import api from "./config";

export type UserInfoResponse = {
  id: string;
  email: string;
  created_at: number;
  confirmed_at: number;
  is_confirmed: boolean;
  username: string;
  avatar_url: string;
  role: string;
};

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

export type AdminQueryParams = {
  sort?: string;
  order?: string;
  page?: number;
  paging?: number;
  query?: string;
};

export type ApiUsageResponse = {
  count: number;
  resource_type: string;
}[];

export type FeedbackResponse = {
  id: string;
  created_at: number;
  reason_feedback: string;
  additional_feedback: string;
  user: {
    id: string;
    email: string;
    username: string;
    avatar_url: string;
    role: string;
    created_at: number;
    confirmed_at: number;
    is_confirmed: boolean;
  };
  message: {
    id: number;
    created_at: number;
    content: string;
    sender_type: "BOT" | "USER";
    conversation_id: string;
    cited_excerpts: Array<{
      id: string;
      source_id: number;
      text: string;
      page: number;
      score: number;
    }>;
  };
};

export type InfoDashboardResponse = {
  user_count: number;
  user_active_count: number;
  user_change_percent: number;
  document_count: number;
  document_change_percent: number;
  conversation_count: number;
  conversation_change_percent: number;
  feedback_count: number;
  feedback_change_percent: number;
  api_usage_count: number;
  api_usage_change_percent: number;
};

export const adminApi = {
  getListUser: async (
    params: AdminQueryParams
  ): Promise<ApiResponse<UserInfoResponse[]>> => {
    const response = await api.get("/v1/admin/users", { params });
    return response.data;
  },

  getListFile: async (
    params: AdminQueryParams
  ): Promise<ApiResponse<FileInfoResponse[]>> => {
    const response = await api.get("/v1/admin/files", { params });
    return response.data;
  },

  getListConversation: async (
    params: AdminQueryParams
  ): Promise<ApiResponse<ConversationInfoResponse[]>> => {
    const response = await api.get("/v1/admin/conversations", { params });
    return response.data;
  },

  getListFeedback: async (
    params: AdminQueryParams
  ): Promise<ApiResponse<FeedbackResponse[]>> => {
    const response = await api.get("/v1/admin/feedbacks", { params });
    return response.data;
  },

  getApiUsageByUserId: async (
    userId: string,
    params: Record<string, string> = {}
  ): Promise<ApiResponse<ApiUsageResponse>> => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(
      `/v1/admin/users/${userId}/api-usage${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  dashboard: async (
    params: Record<string, string> = {}
  ): Promise<ApiResponse<InfoDashboardResponse>> => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(
      `/v1/admin/dashboards${query ? `?${query}` : ""}`
    );
    return response.data;
  },
};
