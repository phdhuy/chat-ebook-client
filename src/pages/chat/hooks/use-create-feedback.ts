import { CreateFeedbackRequest, feedbackApi } from "@/api/feedback-api";
import { useMutation } from "@tanstack/react-query";

export const useCreateFeedback = (messageId: string) => {
  return useMutation({
    mutationFn: (body: CreateFeedbackRequest) =>
      feedbackApi.createFeedback(messageId, body),
  });
};
