import { ApiResponse } from "@/types/api";
import api from '@/api/config';

export type RegisterRequest = {
  email: string;
  password: string;
  confirm_password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export type RegisterResponse = {
  id: string;
  email: string;
  role: string;
  created_at: number;
  is_confirmed: boolean;
}

export const authApi = {
  register: async (body: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    const response = await api.post("/v1/auth/sign-up", body);
    return response.data;
  },

  login: async (body: LoginRequest): Promise<ApiResponse<TokenResponse>> => {
    const response = await api.post("/v1/auth/sign-in", body);
    return response.data;
  },
};