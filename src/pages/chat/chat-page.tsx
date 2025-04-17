import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Download, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "agent" | "user";
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      content: "Hello, I am a generative AI agent. How may I assist you today?",
      timestamp: "4:08:28 PM",
    },
    {
      id: "2",
      role: "user",
      content: "Hi, I'd like to check my bill.",
      timestamp: "4:08:37 PM",
    },
    {
      id: "3",
      role: "agent",
      content:
        "Please hold for a second.\n\nOk, I can help you with that\n\nI'm pulling up your current bill information\n\nYour current bill is $150, and it is due on August 31, 2024.\n\nIf you need more details, feel free to ask!",
      timestamp: "4:08:37 PM",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: generateResponse(input),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("bill") && lowerQuery.includes("detail")) {
      return "Here's a breakdown of your current bill:\n\n• Basic Service: $89.99\n• Premium Channels: $35.00\n• Equipment Rental: $15.00\n• Taxes & Fees: $10.01\n\nTotal: $150.00\n\nDue Date: August 31, 2024";
    } else if (lowerQuery.includes("payment")) {
      return "You can make a payment through several methods:\n\n1. Online through your account dashboard\n2. Using our mobile app\n3. By calling our automated payment system at 1-800-555-0123\n4. By mailing a check to our payment processing center\n\nWould you like me to help you make a payment now?";
    } else if (lowerQuery.includes("due date") || lowerQuery.includes("when")) {
      return "Your current bill of $150.00 is due on August 31, 2024. Would you like to set up a payment reminder?";
    } else {
      return "I'm here to help with any questions about your account or services. Is there something specific about your bill or services you'd like to know?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleFeedback = (type: "like" | "dislike") => {
    console.log("User feedback:", type);
    // You can add logic here to process feedback
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-6 pb-4">
            {messages.map((message) => {
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
                    <span className="font-semibold text-sm">
                      {isUser ? "You" : "AI"}
                    </span>
                  </div>

                  {/* Message Bubble + Timestamp */}
                  <div className="space-y-2">
                    {/* Sender + Timestamp */}
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        // For user messages, align text to the right
                        isUser ? "justify-end" : "justify-start"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isUser
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {isUser ? "You" : "GenerativeAgent"}
                      </span>
                      <span
                        className={cn(
                          "text-xs text-gray-500 dark:text-gray-400",
                          isUser ? "text-right" : "text-left"
                        )}
                      >
                        {message.timestamp}
                      </span>
                    </div>

                    {/* Message Bubble */}
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

                    {/* Agent Tools (Copy/Download/Like/Dislike) */}
                    {!isUser && (
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleCopy(message.content)}
                        >
                          <Copy className="h-3.5 w-3.5 text-gray-500" />
                          <span className="sr-only">Copy message</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Download className="h-3.5 w-3.5 text-gray-500" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <div className="h-4 border-r border-gray-200 dark:border-gray-700 mx-1" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleFeedback("like")}
                        >
                          <ThumbsUp className="h-3.5 w-3.5 text-gray-500" />
                          <span className="sr-only">Like</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleFeedback("dislike")}
                        >
                          <ThumbsDown className="h-3.5 w-3.5 text-gray-500" />
                          <span className="sr-only">Dislike</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] animate-in fade-in-0 duration-300">
                <div className="h-9 w-9 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="font-semibold text-sm">AI</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      GenerativeAgent
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm min-w-[120px]">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
                      <div
                        className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[52px] max-h-32 py-3 px-4 resize-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="h-[52px] px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Send className="h-5 w-5 mr-2" />
              Send
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
            Press Enter to send, Shift+Enter for a new line
          </p>
        </div>
      </div>
    </div>
  );
}
