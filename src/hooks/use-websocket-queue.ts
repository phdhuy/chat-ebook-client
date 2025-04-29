import { useEffect, useRef, useState } from "react";
import { Client, Frame, IMessage } from "@stomp/stompjs";
import { useUserQueue } from "@/hooks/use-user-queue";

export interface Message {
  id: string;
  content: string;
  created_at: number;
  sender_type: string;
  conversation_id: string;
}

export interface WebSocketError {
  message: string;
  originalError?: unknown;
  type?: "connection" | "stomp" | "queue" | "message";
}

export interface UseWebSocketQueueOptions {
  wsUrl?: string;
  credentials?: {
    login: string;
    passcode: string;
  };
  heartbeat?: {
    incoming: number;
    outgoing: number;
  };
  reconnectDelay?: number;
  onConnect?: (queueName: string) => void;
  onError?: (error: WebSocketError) => void;
  onMessage?: (message: Message) => void;
}

export const useWebSocketQueue = (options: UseWebSocketQueueOptions = {}) => {
  const {
    wsUrl = import.meta.env.VITE_WS_ENDPOINT || "",
    credentials = { login: "guest", passcode: "guest" },
    heartbeat = { incoming: 4000, outgoing: 4000 },
    reconnectDelay = 5000,
    onConnect,
    onError,
    onMessage,
  } = options;

  const [queueName, setQueueName] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);

  const {
    mutate: createQueue,
    isError,
    error,
  } = useUserQueue({
    onSuccess: (response) => {
      const name = response.data.queue_name;
      console.log(`Queue created: ${name}`);
      setQueueName(name);
      if (onConnect) onConnect(name);
    },
    onError: (err) => {
      console.error("Failed to create queue:", err);
      setConnectionError("Failed to create queue");
      if (onError)
        onError({
          message: "Failed to create queue",
          originalError: err,
          type: "queue",
        });
    },
  });

  useEffect(() => {
    createQueue();
  }, []);

  useEffect(() => {
    if (!queueName) return;

    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        login: credentials.login,
        passcode: credentials.passcode,
      },
      reconnectDelay,
      heartbeatIncoming: heartbeat.incoming,
      heartbeatOutgoing: heartbeat.outgoing,
    });

    client.onConnect = () => {
      setConnected(true);
      setConnectionError(null);

      const subscriptionHeaders = {
        id: `sub-${queueName}`,
        ack: "auto",
        "auto-delete": "true",
        "x-queue-name": queueName,
        durable: "true",
        exclusive: "false",
      };

      client.subscribe(
        `/queue/${queueName}`,
        (msg: IMessage) => {
          try {
            const parsed = JSON.parse(msg.body);
            const content = parsed.content || parsed.text || "Unknown content";
            const createdAt =
              parsed.created_at ||
              (parsed.timestamp
                ? new Date(parsed.timestamp).getTime()
                : Date.now());

            const messageObj: Message = {
              id: parsed.id || `ws-${Date.now()}`,
              content,
              created_at: createdAt,
              sender_type: parsed.sender_type || "bot",
              conversation_id: parsed.conversation_id || "unknown",
            };

            setMessages((prev) => [...prev, messageObj]);
            if (onMessage) onMessage(messageObj);
          } catch (e) {
            console.warn("Failed to parse message:", msg.body);
            console.log(e);

            const messageObj: Message = {
              id: `error-${Date.now()}`,
              content: msg.body,
              created_at: Date.now(),
              sender_type: "error",
              conversation_id: "unknown",
            };
            setMessages((prev) => [...prev, messageObj]);
            if (onMessage) onMessage(messageObj);
          }
        },
        subscriptionHeaders
      );
    };

    client.onStompError = (frame: Frame) => {
      const errorMsg = `STOMP Error: ${frame.headers["message"]}`;
      console.error(errorMsg, frame.body);
      setConnectionError(errorMsg);
      if (onError)
        onError({
          message: errorMsg,
          originalError: frame,
          type: "stomp",
        });
    };

    client.onWebSocketError = (evt) => {
      console.error("WebSocket error:", evt);
      setConnectionError("WebSocket connection error");
      setConnected(false);
      if (onError)
        onError({
          message: "WebSocket connection error",
          originalError: evt,
          type: "connection",
        });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
        setConnected(false);
      }
    };
  }, [
    queueName,
    wsUrl,
    reconnectDelay,
    heartbeat.incoming,
    heartbeat.outgoing,
    credentials.login,
    credentials.passcode,
    onMessage,
    onError,
  ]);

  return {
    queueName,
    connected,
    messages,
    error: connectionError || (isError ? String(error) : null),
    isError: !!connectionError || isError,
  };
};

export default useWebSocketQueue;