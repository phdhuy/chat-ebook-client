import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageItem, Message } from "./chat-message-item";

interface ChatMessageListProps {
  messages: Message[];
  onCopy?: (content: string) => void;
  onFeedback?: (type: "like" | "dislike") => void;
  isLoading?: boolean;
  error?: Error | null;
  scrollToBottom?: boolean;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  onCopy,
  onFeedback,
  isLoading,
  error,
  scrollToBottom = false,
}) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToBottom && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, scrollToBottom]);

  return (
    <ScrollArea className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-6 pb-4">
        {isLoading && <div>Loading messages...</div>}
        {error && <div>Error: {error.message}</div>}
        {messages.map((m) => (
          <ChatMessageItem
            key={m.id}
            message={m}
            onCopy={onCopy}
            onFeedback={onFeedback}
          />
        ))}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
};