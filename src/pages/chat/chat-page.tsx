import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  useWebSocketQueue,
  Message as WSMessage,
  WebSocketError,
} from "@/hooks/use-websocket-queue";
import {
  formatDateTime,
  mapSenderTypeToRole,
  MESSAGE_PER_PAGE,
} from "@/common";
import { ChatMessageList } from "@/components/chat/chat-message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetListMessage } from "./hooks/use-get-list-message";
import { useCreateMessage } from "./hooks/use-create-message";
import { useSelectedTextStore } from "@/stores/use-selected-text-store";
import { useSummarizeEbook } from "./hooks/use-summarize-ebook";
import { ChatSkeleton } from "@/components/chat/chat-skeleton";
import { ChatHeader } from "@/components/chat/chat-header";
import MindmapModal from "@/components/modal/mindmap-modal";

type UIMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
  isNewBotMessage: boolean;
  is_negative_feedback?: boolean;
  cited_excerpts?: Array<{
    id: string;
    source_id: number;
    text: string;
    page: number;
    score: number;
  }>;
};

export default function ChatPage() {
  const { id: conversationId = "" } = useParams();
  const conversationRef = useRef<string>(conversationId);
  const [input, setInput] = useState("");
  const [historicalMessages, setHistoricalMessages] = useState<UIMessage[]>([]);
  const [liveMessages, setLiveMessages] = useState<UIMessage[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMindmapOpen, setIsMindmapOpen] = useState(false);
  const isInitialLoadRef = useRef(true);
  const shouldScrollToBottomRef = useRef(true);
  const prevHistoricalLengthRef = useRef(0);

  const scrollPosRef = useRef<number | null>(null);
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  const { selectedText, clearSelectedText } = useSelectedTextStore();

  useEffect(() => {
    if (selectedText) {
      setInput(selectedText);
      clearSelectedText();
    }
  }, [selectedText, clearSelectedText]);

  useEffect(() => {
    conversationRef.current = conversationId;
    setHistoricalMessages([]);
    setLiveMessages([]);
    setInput("");
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
    { sort: "id", order: "desc", page, paging: MESSAGE_PER_PAGE },
    conversationId
  );

  useEffect(() => {
    scrollableDivRef.current = document.getElementById(
      "scrollableDiv"
    ) as HTMLDivElement;
  }, []);

  useEffect(() => {
    if (data?.data) {
      const history: UIMessage[] = data.data.map((msg) => ({
        id: msg.id.toString(),
        role: mapSenderTypeToRole(msg.sender_type),
        content: msg.content,
        timestamp: formatDateTime(msg.created_at),
        isNewBotMessage: false,
        is_negative_feedback: msg.is_negative_feedback,
        cited_excerpts: msg.cited_excerpts,
      }));

      if (data.data.length < MESSAGE_PER_PAGE) {
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
    if (
      !isInitialLoadRef.current &&
      scrollPosRef.current !== null &&
      scrollableDivRef.current
    ) {
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
      id: msg.id.toString(),
      role: mapSenderTypeToRole(msg.sender_type),
      content: msg.content,
      timestamp: formatDateTime(msg.created_at),
      isNewBotMessage: msg.sender_type.toLowerCase() === "bot",
      is_negative_feedback: msg.is_negative_feedback,
      cited_excerpts: msg.cited_excerpts,
    };
    shouldScrollToBottomRef.current = true;
    setLiveMessages((prev) => [...prev, uiMsg]);
  }, []);

  useEffect(() => {
    if (
      liveMessages.length > 0 &&
      shouldScrollToBottomRef.current &&
      scrollableDivRef.current
    ) {
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

  const { mutate: summarizeEbook, isPending: isSummarizing } =
    useSummarizeEbook();

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    shouldScrollToBottomRef.current = true;
    createMessage({ conversationId, body: { content: input } });
  }, [input, conversationId, createMessage]);

  const handleSummarize = useCallback(() => {
    summarizeEbook(
      { conversationId, body: { content: "Summarize this ebook" } },
      {
        onError: (error) => {
          console.error("Summarize ebook error:", error);
        },
      }
    );
  }, [summarizeEbook, conversationId]);

  const handleGenerateMindmap = useCallback(() => {
    setIsMindmapOpen(true);
  }, []);

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
    <>
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex-1 flex flex-col w-full mx-auto shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
          {isLoading && page === 1 ? (
            <ChatSkeleton />
          ) : (
            <>
              <ChatHeader
                conversationId={conversationId}
                conversationTitle="AI Assistant Chat"
                onSummarizeEbook={handleSummarize}
                isSummarizing={isSummarizing}
                onGenerateMindmap={handleGenerateMindmap}
              />
              <div
                id="scrollableDiv"
                className="flex-1 overflow-auto flex flex-col-reverse custom-scrollbar"
              >
                <InfiniteScroll
                  dataLength={messagesToDisplay.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={loader}
                  scrollableTarget="scrollableDiv"
                  inverse={true}
                  style={{ display: "flex", flexDirection: "column-reverse" }}
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
              <ChatInput
                input={input}
                onChange={setInput}
                onSend={handleSend}
                disabled={isSending}
              />
            </>
          )}
        </div>
      </div>

      {/* Mindmap Modal */}
      <MindmapModal
        isOpen={isMindmapOpen}
        onOpenChange={setIsMindmapOpen}
        conversationId={conversationId}
      />
    </>
  );
}
