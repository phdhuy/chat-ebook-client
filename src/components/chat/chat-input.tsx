import type React from "react";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Type your message...",
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !disabled) {
        onSend();
      }
    }
  };

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend();
    }
  };

  return (
    <div
      className={cn(
        "p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800",
        className
      )}
    >
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 transition-all duration-200">
          <Textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={input}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="flex-1 min-h-[20px] max-h-[120px] py-2 px-0 border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
            style={{ height: "auto" }}
          />

          <Button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            size="sm"
            className={cn(
              "h-8 w-8 p-0 rounded-full transition-all duration-200",
              input.trim() && !disabled
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 px-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press{" "}
            <kbd className="px-1 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">
              Enter
            </kbd>{" "}
            to send,
            <kbd className="px-1 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded ml-1">
              Shift + Enter
            </kbd>{" "}
            for new line
          </p>

          {input.length > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {input.length} characters
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
