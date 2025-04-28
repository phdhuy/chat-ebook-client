import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  timestamp: string;
}

interface ChatMessageItemProps {
  message: Message;
  onCopy?: (content: string) => void;
  onFeedback?: (type: "like" | "dislike") => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onCopy, onFeedback }) => {
  const isUser = message.role === "user";

  return (
    <div
      key={message.id}
      className={cn(
        "flex gap-3 max-w-[85%] animate-in fade-in-0 slide-in-from-bottom-3 duration-300",
        isUser ? "ml-auto flex-row-reverse" : ""
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
          isUser
            ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            : "bg-purple-600 text-white"
        )}
      >
        <span className="font-semibold text-sm">{isUser ? "You" : "AI"}</span>
      </div>

      {/* Bubble + Timestamp */}
      <div className="space-y-2">
        <div className={cn("flex items-center gap-2", isUser ? "justify-end" : "justify-start")}>  
          <span className={cn("text-sm font-medium", isUser ? "text-gray-700 dark:text-gray-300" : "text-gray-700 dark:text-gray-300")}>  
            {isUser ? "You" : "GenerativeAgent"}
          </span>
          <span className={cn("text-xs text-gray-500 dark:text-gray-400", isUser ? "text-right" : "text-left")}>  
            {message.timestamp}
          </span>
        </div>
        <div
          className={cn(
            "p-3.5 rounded-2xl text-sm shadow-sm whitespace-pre-wrap leading-relaxed border",
            isUser
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          )}
        >
          {message.content}
        </div>
        {!isUser && (
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => onCopy?.(message.content)}>
              <Copy className="h-3.5 w-3.5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-3.5 w-3.5 text-gray-500" />
            </Button>
            <div className="h-4 border-r border-gray-200 dark:border-gray-700 mx-1" />
            <Button variant="ghost" size="icon" onClick={() => onFeedback?.("like")}>
              <ThumbsUp className="h-3.5 w-3.5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onFeedback?.("dislike")}>
              <ThumbsDown className="h-3.5 w-3.5 text-gray-500" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};