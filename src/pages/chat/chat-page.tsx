import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useWebSocketQueue,
  Message as WSMessage,
  WebSocketError,
} from "@/hooks/use-websocket-queue";
import { useCreateMessage } from "./hooks/use-create-message";
import { useGetListMessage } from "./hooks/use-get-list-message";
import { formatDateTime } from "@/common";
import { ChatMessageList } from "@/components/chat/chat-message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { Message as UIMessage } from "@/components/chat/chat-message-item";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPage() {
  const { id: conversationId = "" } = useParams();
  const conversationRef = useRef<string>(conversationId);
  const [input, setInput] = useState("");
  const [historicalMessages, setHistoricalMessages] = useState<UIMessage[]>([]);
  const [liveMessages, setLiveMessages] = useState<UIMessage[]>([]);

  useEffect(() => {
    conversationRef.current = conversationId;
    setHistoricalMessages([]);
    setLiveMessages([]);
  }, [conversationId]);

  const { data, isLoading, error: restError } = useGetListMessage(
    { sort: "id", order: "asc", page: 1, paging: 50 },
    conversationId
  );

  useEffect(() => {
    if (data?.data && historicalMessages.length === 0) {
      const history: UIMessage[] = data.data.map((msg) => ({
        id: msg.id.toString(),
        role: msg.sender_type.toLowerCase() === "user" ? "user" : "bot",
        content: msg.content,
        timestamp: formatDateTime(msg.created_at),
      }));
      setHistoricalMessages(history);
    }
  }, [data?.data, historicalMessages.length]);

  const onMessage = useCallback((msg: WSMessage) => {
    if (msg.conversation_id !== conversationRef.current) return;
    const uiMsg: UIMessage = {
      id: msg.id,
      role: msg.sender_type.toLowerCase() === "user" ? "user" : "bot",
      content: msg.content,
      timestamp: formatDateTime(msg.created_at),
    };
    setLiveMessages((prev) => [...prev, uiMsg]);
  }, []);

  const onError = useCallback((err: WebSocketError) => {
    console.error("WebSocket error:", err);
  }, []);

  const { error: wsError } = useWebSocketQueue({ onError, onMessage });

  const { mutate: createMessage, isPending: isSending } = useCreateMessage({
    onSuccess: () => setInput(""),
    onError: console.error,
  });

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    createMessage({ conversationId, body: { content: input } });
  }, [input, conversationId, createMessage]);

  const messagesToDisplay = useMemo(() => {
    const seen = new Set<string>();
    return [...historicalMessages, ...liveMessages].filter((msg) => {
      if (seen.has(msg.id)) return false;
      seen.add(msg.id);
      return true;
    });
  }, [historicalMessages, liveMessages]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ChatMessageList
            messages={messagesToDisplay}
            isLoading={isLoading}
            error={restError || (wsError ? new Error(wsError) : null)}
            onCopy={(text) => navigator.clipboard.writeText(text)}
            onFeedback={(t) => console.log("Feedback:", t)}
          />
        )}

        <ChatInput
          input={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isSending}
        />
      </div>
    </div>
  );
}