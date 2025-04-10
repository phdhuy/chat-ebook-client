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

export const userApi = {
  getMyProfile: async (): Promise<ApiResponse<UserInfoResponse>> => {
    const response = await api.get("/v1/users/me");
    return response.data;
  },
};
