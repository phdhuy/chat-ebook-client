import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Download,
  ThumbsUp,
  ThumbsDown,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { ReactTyped } from "react-typed";
import { FeedbackModal } from "../modal/feedback-modal";
import { useReferencePageStore } from "@/stores/use-reference-page-store";
import { useCreateFeedback } from "@/pages/chat/hooks/use-create-feedback";
import { CreateFeedbackRequest } from "@/api/feedback-api";

export interface Message {
  id: string | number;
  role: "bot" | "user";
  content: string;
  timestamp: string;
  sender_type?: "BOT" | "USER";
  conversation_id?: string;
  isNewBotMessage?: boolean;
  cited_excerpts?: Array<{
    id: string;
    source_id: number;
    text: string;
    page: number;
    score: number;
  }>;
}

interface ChatMessageItemProps {
  message: Message;
  onCopy?: (content: string) => void;
  onFeedback?: (type: "like" | "dislike") => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onCopy,
  onFeedback,
}) => {
  const isUser = message.role === "user" || message.sender_type === "USER";
  const [copied, setCopied] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(
    !message.isNewBotMessage
  );
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [showCitations, setShowCitations] = useState(false);
  const { setReferencePage } = useReferencePageStore();
  const createFeedbackMutation = useCreateFeedback(message.id.toString());

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    onCopy?.(message.content);
    setCopied(true);
  };

  const handleTypingComplete = () => {
    setIsTypingComplete(true);
  };

  const handleLike = () => {
    onFeedback?.("like");
  };

  const handleDislikeClick = () => {
    setIsFeedbackOpen(true);
  };

  const handleFeedbackSubmit = (data: { reason: string; details: string }) => {
    const feedback: CreateFeedbackRequest = {
      reason_feedback: data.reason,
      additional_feedback: data.details,
    };
    createFeedbackMutation.mutate(feedback, {
      onSuccess: () => {
        onFeedback?.("dislike");
        setIsFeedbackOpen(false);
      },
      onError: (error) => {
        console.error("Failed to submit feedback:", error);
      },
    });
  };

  const processedContent = useMemo(() => {
    if (message.isNewBotMessage && !isTypingComplete) {
      return message.content;
    }

    return message.content.replace(
      /\[([^\]]+)\]/g,
      (_match: string, p1: string) => {
        const citations = p1.split(",").map((c: string) => c.trim());

        const processedCitations = citations.map((citation: string) => {
          const pageNumber = parseInt(citation);

          if (!isNaN(pageNumber)) {
            const url = `/source/${pageNumber}/page/${pageNumber}`;
            return `[Page ${pageNumber}](${url} "Source ${pageNumber}, page ${pageNumber}")`;
          }

          return citation;
        });

        return processedCitations.join(" ");
      }
    );
  }, [message.content, isTypingComplete, message.isNewBotMessage]);

  const uniqueCitations = useMemo(() => {
    if (!message.cited_excerpts) return [];

    const citationMap = new Map();
    message.cited_excerpts.forEach((excerpt) => {
      if (!citationMap.has(excerpt.source_id)) {
        citationMap.set(excerpt.source_id, excerpt);
      }
    });

    return Array.from(citationMap.values()).sort(
      (a, b) => a.source_id - b.source_id
    );
  }, [message.cited_excerpts]);

  const shouldShowCitations =
    !isUser && uniqueCitations.length > 0 && isTypingComplete;

  return (
    <>
      <div
        key={message.id}
        className={cn(
          "flex gap-3 max-w-[85%] animate-in fade-in-0 slide-in-from-bottom-3 duration-300",
          isUser ? "ml-auto flex-row-reverse" : ""
        )}
      >
        <div
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
            isUser ? "bg-blue-500 text-white" : "bg-purple-600 text-white"
          )}
        >
          <span className="font-semibold text-sm">{isUser ? "U" : "AI"}</span>
        </div>

        <div className="space-y-2">
          <div
            className={cn(
              "flex items-center gap-2",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            <span
              className={cn(
                "text-sm font-medium",
                isUser
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-purple-600 dark:text-purple-400"
              )}
            >
              {isUser ? "You" : "AI Assistant"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {message.timestamp}
            </span>
          </div>

          <div
            className={cn(
              "p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed border",
              isUser
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-black dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            )}
          >
            {isUser ? (
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ) : isTypingComplete ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    a: ({ href, title, children, ...props }) => {
                      if (href && href.match(/^\/source\/\d+\/page\/\d+$/)) {
                        const pageMatch = href.match(/page\/(\d+)/);
                        if (pageMatch) {
                          const page = parseInt(pageMatch[1], 10);
                          return (
                            <a
                              role="button"
                              title={title}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-1 underline-offset-2"
                              onClick={(e) => {
                                e.preventDefault();
                                setReferencePage(page);
                              }}
                              {...props}
                            >
                              {children}
                            </a>
                          );
                        }
                      }
                      return <span>{children}</span>;
                    },
                  }}
                >
                  {processedContent}
                </ReactMarkdown>
              </div>
            ) : (
              <ReactTyped
                strings={[processedContent]}
                typeSpeed={0}
                backSpeed={0}
                loop={false}
                showCursor={true}
                cursorChar="|"
                onComplete={handleTypingComplete}
              />
            )}
          </div>

          {shouldShowCitations && (
            <div className="mt-3">
              <button
                onClick={() => setShowCitations(!showCitations)}
                className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <FileText className="h-3 w-3" />
                <span>References ({uniqueCitations.length})</span>
                <span
                  className={cn(
                    "transition-transform",
                    showCitations && "rotate-180"
                  )}
                >
                  ▼
                </span>
              </button>

              {showCitations && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                  {uniqueCitations.map((citation) => (
                    <div key={citation.id} className="text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          [{citation.source_id}]
                        </span>
                        <span className="text-gray-500">
                          Page {citation.page} • Confidence:{" "}
                          {citation.score.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 p-2 rounded border-l-2 border-blue-200 dark:border-blue-800">
                        {citation.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isUser && (
            <div className="flex items-center gap-1.5 pt-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-7 w-7"
                title="Copy"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-gray-500" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Download"
              >
                <Download className="h-3.5 w-3.5 text-gray-500" />
              </Button>
              <div className="h-4 border-r border-gray-200 dark:border-gray-700 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                className="h-7 w-7"
                title="Helpful"
              >
                <ThumbsUp className="h-3.5 w-3.5 text-gray-500 hover:text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDislikeClick}
                className="h-7 w-7"
                title="Report issue"
              >
                <ThumbsDown className="h-3.5 w-3.5 text-gray-500 hover:text-red-500" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <FeedbackModal
        open={isFeedbackOpen}
        onOpenChange={setIsFeedbackOpen}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  );
};