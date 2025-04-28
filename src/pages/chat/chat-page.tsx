import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateMessage } from "./hooks/use-create-message";
import { useGetListMessage } from "./hooks/use-get-list-message";
import { formatDateTime } from "@/common";
import { ChatMessageList } from "@/components/chat/chat-message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { Message } from "@/components/chat/chat-message-item";

export default function ChatPage() {
  const { id: conversationId = "" } = useParams();
  const [input, setInput] = useState("");

  const { data, isLoading, error } = useGetListMessage(
    { sort: "id", order: "asc", page: 1, paging: 50 },
    conversationId
  );

  const messages: Message[] =
    data?.data.map((msg): Message => {
      const role = msg.sender_type.toLowerCase() === "user" ? "user" : "bot";
      return {
        id: msg.id.toString(),
        role,
        content: msg.content,
        timestamp: formatDateTime(msg.created_at),
      };
    }) || [];

  const { mutate: createMessage, isPending: isSending } = useCreateMessage({
    onSuccess: () => setInput(""),
    onError: console.error,
  });

  const handleSend = () => {
    if (!input.trim()) return;
    createMessage({ conversationId, body: { content: input } });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
        <ChatMessageList
          messages={messages}
          isLoading={isLoading}
          error={error}
          onCopy={(c) => navigator.clipboard.writeText(c)}
          onFeedback={(t) => console.log("Feedback:", t)}
        />
        <ChatInput input={input} onChange={setInput} onSend={handleSend} disabled={isSending} />
      </div>
    </div>
  );
}