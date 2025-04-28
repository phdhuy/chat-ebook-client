import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ input, onChange, onSend, disabled }) => (
  <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
    <div className="flex gap-3 items-end">
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
        className="min-h-[52px] max-h-32 py-3 px-4 resize-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500 flex-1"
      />
      <Button onClick={onSend} disabled={!input.trim() || disabled} className="h-[52px] px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md">
        <Send className="h-5 w-5 mr-2" /> Send
      </Button>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
      Press Enter to send, Shift+Enter for a new line
    </p>
  </div>
);