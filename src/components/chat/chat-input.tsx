import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, FileText, Loader2 } from "lucide-react";

interface ChatInputProps {
  input: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onSummarize: () => void;
  disabled?: boolean;
  isSummarizing?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onChange,
  onSend,
  onSummarize,
  disabled,
  isSummarizing,
}) => (
  <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
    <div className="flex gap-3 items-end">
      <button
        onClick={onSummarize}
        disabled={disabled || isSummarizing}
        className={`h-[52px] w-[52px] flex items-center justify-center rounded-xl ${
          disabled || isSummarizing
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        title="Summarize ebook"
      >
        {isSummarizing ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-600 dark:text-gray-300" />
        ) : (
          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>
      <Textarea
        placeholder="Type a message..."
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        className="min-h-[52px] max-h-32 py-3 px-4 resize-none text-black bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500 flex-1"
      />
      <Button
        onClick={onSend}
        disabled={!input.trim() || disabled}
        className="h-[52px] px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md"
      >
        <Send className="h-5 w-5 mr-2" /> Send
      </Button>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
      Press Enter to send, Shift+Enter for a new line
    </p>
  </div>
);