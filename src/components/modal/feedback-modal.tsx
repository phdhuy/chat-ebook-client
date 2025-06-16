import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FeedbackOption = {
  id: string;
  label: string;
  description?: string;
};

const feedbackOptions: FeedbackOption[] = [
  {
    id: "TOO_SHORT",
    label: "Too short",
    description: "The response didn't provide enough information",
  },
  {
    id: "TOO_LONG",
    label: "Too long",
    description: "The response was unnecessarily verbose",
  },
  {
    id: "POOR_FORMATTING",
    label: "Poor formatting",
    description: "The response was difficult to read",
  },
  {
    id: "MISSING_OR_INCORRECT_CITATION",
    label: "Missing or incorrect citation",
    description: "Sources weren't cited or were cited incorrectly",
  },
  {
    id: "FABRICATED_INFORMATION",
    label: "Fabricated information",
    description: "The response contained made-up information",
  },
  {
    id: "DOESNT_ANSWER_THE_QUESTION",
    label: "Doesn't answer the question",
    description: "The response didn't address my query",
  },
  {
    id: "WRONG_LANGUAGE",
    label: "Wrong language",
    description: "The response was in the wrong language",
  },
];

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: { reason: string; details: string }) => void;
}

export function FeedbackModal({
  open,
  onOpenChange,
  onSubmit,
}: FeedbackModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherFeedback, setOtherFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason && !otherFeedback) return;

    setIsSubmitting(true);

    setTimeout(() => {
      if (onSubmit) {
        onSubmit({
          reason: selectedReason || "",
          details: otherFeedback,
        });
      }
      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedReason(null);
        setOtherFeedback("");
        onOpenChange(false);
      }, 1500);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-zinc-900 border-none shadow-xl rounded-xl">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-[400px]">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Thank you for your feedback
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Your feedback helps us improve our responses.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  How can we improve this response?
                </DialogTitle>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Select a reason or provide details to help us improve
              </p>
            </DialogHeader>

            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1 mb-6">
                {feedbackOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedReason(option.id)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all",
                      selectedReason === option.id
                        ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                        : "hover:bg-gray-50 dark:hover:bg-zinc-800/50 border border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 mt-0.5 rounded-full border flex-shrink-0 flex items-center justify-center",
                        selectedReason === option.id
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300 dark:border-zinc-600"
                      )}
                    >
                      {selectedReason === option.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <div
                        className={cn(
                          "font-medium",
                          selectedReason === option.id
                            ? "text-purple-700 dark:text-purple-300"
                            : "text-gray-700 dark:text-gray-200"
                        )}
                      >
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="other-feedback"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Additional feedback
                </label>
                <Textarea
                  id="other-feedback"
                  placeholder="Tell us more about how we can improve..."
                  value={otherFeedback}
                  onChange={(e) => setOtherFeedback(e.target.value)}
                  className="min-h-[80px] resize-none border-gray-200 dark:border-zinc-700 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || (!selectedReason && !otherFeedback)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5"
              >
                {isSubmitting ? "Submitting..." : "Submit feedback"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
