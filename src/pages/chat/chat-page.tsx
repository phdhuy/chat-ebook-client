import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesPerPage = 10;
  const isInitialLoadRef = useRef(true);
  const shouldScrollToBottomRef = useRef(true);
  const prevHistoricalLengthRef = useRef(0);

  const scrollPosRef = useRef<number | null>(null);
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    conversationRef.current = conversationId;
    setHistoricalMessages([]);
    setLiveMessages([]);
    setPage(1);
    setHasMore(true);
    isInitialLoadRef.current = true;
    shouldScrollToBottomRef.current = true;
    prevHistoricalLengthRef.current = 0;
  }, [conversationId]);

  const {
    data,
    isLoading,
    error: restError,
  } = useGetListMessage(
    { sort: "id", order: "desc", page, paging: messagesPerPage },
    conversationId
  );

  useEffect(() => {
    scrollableDivRef.current = document.getElementById("scrollableDiv") as HTMLDivElement;
  }, []);

  useEffect(() => {
    if (data?.data) {
      const history: UIMessage[] = data.data.map((msg) => ({
        id: msg.id.toString(),
        role: msg.sender_type.toLowerCase() === "user" ? "user" : "bot",
        content: msg.content,
        timestamp: formatDateTime(msg.created_at),
      }));

      if (data.data.length < messagesPerPage) {
        setHasMore(false);
      }

      if (!isInitialLoadRef.current && scrollableDivRef.current) {
        scrollPosRef.current = scrollableDivRef.current.scrollTop;
        prevHistoricalLengthRef.current = historicalMessages.length;
      }

      setHistoricalMessages((prev) => {
        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
          shouldScrollToBottomRef.current = true;
          return history;
        } else {
          shouldScrollToBottomRef.current = false;
          return [...history, ...prev];
        }
      });
    }
  }, [data?.data]);

  useEffect(() => {
    if (!isInitialLoadRef.current && scrollPosRef.current !== null && scrollableDivRef.current) {
      if (historicalMessages.length > prevHistoricalLengthRef.current) {
        setTimeout(() => {
          if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTop = scrollPosRef.current || 0;
          }
        }, 10);
      }
    }
  }, [historicalMessages]);

  const onMessage = useCallback((msg: WSMessage) => {
    if (msg.conversation_id !== conversationRef.current) return;
    const uiMsg: UIMessage = {
      id: msg.id,
      role: msg.sender_type.toLowerCase() === "user" ? "user" : "bot",
      content: msg.content,
      timestamp: formatDateTime(msg.created_at),
    };
    shouldScrollToBottomRef.current = true;
    setLiveMessages((prev) => [...prev, uiMsg]);
  }, []);

  useEffect(() => {
    if (liveMessages.length > 0 && shouldScrollToBottomRef.current && scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = 0;
    }
  }, [liveMessages]);

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
    shouldScrollToBottomRef.current = true;
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

  const fetchMoreData = () => {
    if (scrollableDivRef.current) {
      scrollPosRef.current = scrollableDivRef.current.scrollTop;
    }
    setPage((prevPage) => prevPage + 1);
  };

  const loader = (
    <div className="p-4 flex justify-center">
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
        {isLoading && page === 1 ? (
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
          <div
            id="scrollableDiv"
            className="flex-1 overflow-auto flex flex-col-reverse"
          >
            <InfiniteScroll
              dataLength={messagesToDisplay.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={loader}
              scrollableTarget="scrollableDiv"
              inverse={true}
              style={{ display: "flex", flexDirection: "column-reverse" }}
              endMessage={
                <div className="text-center p-2 text-sm text-gray-500">
                  You've reached the beginning of this conversation
                </div>
              }
            >
              <ChatMessageList
                messages={messagesToDisplay}
                isLoading={false}
                error={restError || (wsError ? new Error(wsError) : null)}
                onCopy={(text) => navigator.clipboard.writeText(text)}
                onFeedback={(t) => console.log("Feedback:", t)}
                scrollToBottom={shouldScrollToBottomRef.current}
              />
            </InfiniteScroll>
          </div>
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