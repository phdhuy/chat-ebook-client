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
  order?: "asc" | "desc";
  page?: number;
  paging?: number;
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
};
