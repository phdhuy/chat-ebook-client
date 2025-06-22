import { ApiResponse } from "@/types/api";
import api from "./config";

export type CreateFeedbackRequest = {
  reason_feedback: string;
  additional_feedback: string;
  is_negative_feedback: boolean;
};

export const feedbackApi = {
  createFeedback: async (
    messageId: string,
    body: CreateFeedbackRequest
  ): Promise<ApiResponse<void>> => {
    const response = await api.post(`/v1/messages/${messageId}/feedbacks`, body);
    return response.data;
  },
};
