import { useEffect, useState, useCallback, useRef } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { useAuth } from "./use-auth";
import {
  NewMessageEvent,
  TypingIndicatorEvent,
  UserPresenceEvent,
  ReadReceiptEvent,
  ConversationEvent,
  NotificationEvent,
  UserJoinedEvent,
  UserLeftEvent,
} from "@/types/chat";
export const useSignalR = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const connectionRef = useRef<HubConnection | null>(null);

  // Event handlers state with proper types
  const [messageHandlers, setMessageHandlers] = useState<
    ((data: NewMessageEvent) => void)[]
  >([]);
  const [typingHandlers, setTypingHandlers] = useState<
    ((data: TypingIndicatorEvent) => void)[]
  >([]);
  const [presenceHandlers, setPresenceHandlers] = useState<
    ((data: UserPresenceEvent & { isOnline: boolean }) => void)[]
  >([]);
  const [readReceiptHandlers, setReadReceiptHandlers] = useState<
    ((data: ReadReceiptEvent) => void)[]
  >([]);
  const [conversationEventHandlers, setConversationEventHandlers] = useState<
    ((data: ConversationEvent) => void)[]
  >([]);
  const [notificationHandlers, setNotificationHandlers] = useState<
    ((data: NotificationEvent) => void)[]
  >([]);

  const { isAuthenticated, user } = useAuth();

  // Function to get token directly from storage
  const getToken = useCallback(() => {
    return (
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken")
    );
  }, []);

  // Initialize connection
  useEffect(() => {
    const token = getToken();
    if (!token || !isAuthenticated()) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/chatHub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = newConnection;
    setConnection(newConnection);

    return () => {
      if (connectionRef.current?.state === HubConnectionState.Connected) {
        connectionRef.current.stop();
      }
    };
  }, [getToken, isAuthenticated]);

  // Set up event listeners
  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        await connection.start();
        setIsConnected(true);
        console.log("SignalR Connected");
      } catch (err) {
        console.error("SignalR Connection Error:", err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    // Message events
    connection.on("NewMessage", (data: NewMessageEvent) => {
      messageHandlers.forEach((handler) => handler(data));
    });

    connection.on("NewShopMessage", (data: NewMessageEvent) => {
      messageHandlers.forEach((handler) => handler({ ...data, type: "shop" }));
    });

    connection.on("NewCustomerMessage", (data: NewMessageEvent) => {
      messageHandlers.forEach((handler) =>
        handler({ ...data, type: "customer" }),
      );
    });

    connection.on("NewStaffMessage", (data: NewMessageEvent) => {
      messageHandlers.forEach((handler) => handler({ ...data, type: "staff" }));
    });

    // Typing indicators
    connection.on("UserTyping", (data: TypingIndicatorEvent) => {
      typingHandlers.forEach((handler) => handler(data));
    });

    connection.on("ShopTyping", (data: TypingIndicatorEvent) => {
      typingHandlers.forEach((handler) => handler({ ...data, type: "shop" }));
    });

    connection.on("CustomerTyping", (data: TypingIndicatorEvent) => {
      typingHandlers.forEach((handler) =>
        handler({ ...data, type: "customer" }),
      );
    });

    connection.on("StaffTyping", (data: TypingIndicatorEvent) => {
      typingHandlers.forEach((handler) => handler({ ...data, type: "staff" }));
    });

    // Presence
    connection.on("UserOnline", (data: UserPresenceEvent) => {
      setOnlineUsers((prev) => new Set(prev).add(data.userId));
      presenceHandlers.forEach((handler) =>
        handler({ ...data, isOnline: true }),
      );
    });

    connection.on("UserOffline", (data: UserPresenceEvent) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
      presenceHandlers.forEach((handler) =>
        handler({ ...data, isOnline: false }),
      );
    });

    // Read receipts
    connection.on("MessagesRead", (data: ReadReceiptEvent) => {
      readReceiptHandlers.forEach((handler) => handler(data));
    });

    // Conversation events
    connection.on("UserJoined", (data: UserJoinedEvent) => {
      conversationEventHandlers.forEach((handler) =>
        handler({
          ...data,
          type: "joined",
          userId: data.userId,
        }),
      );
    });

    connection.on("UserLeft", (data: UserLeftEvent) => {
      conversationEventHandlers.forEach((handler) =>
        handler({
          ...data,
          type: "left",
          userId: data.userId,
        }),
      );
    });

    connection.on("ConversationResolved", (data: any) => {
      conversationEventHandlers.forEach((handler) =>
        handler({
          ...data,
          type: "resolved",
        }),
      );
    });

    connection.on("ConversationReopened", (data: any) => {
      conversationEventHandlers.forEach((handler) =>
        handler({
          ...data,
          type: "reopened",
        }),
      );
    });

    connection.on("ParticipantAdded", (data: any) => {
      conversationEventHandlers.forEach((handler) =>
        handler({
          ...data,
          type: "participantAdded",
        }),
      );
    });

    connection.on("ParticipantRemoved", (data: any) => {
      conversationEventHandlers.forEach((handler) =>
        handler({
          ...data,
          type: "participantRemoved",
        }),
      );
    });

    // Notifications
    connection.on("NewMessageNotification", (data: NotificationEvent) => {
      notificationHandlers.forEach((handler) => handler(data));
    });

    connection.onreconnecting(() => {
      setIsConnected(false);
      console.log("SignalR Reconnecting...");
    });

    connection.onreconnected(() => {
      setIsConnected(true);
      console.log("SignalR Reconnected");
    });

    return () => {
      connection.off("NewMessage");
      connection.off("NewShopMessage");
      connection.off("NewCustomerMessage");
      connection.off("NewStaffMessage");
      connection.off("UserTyping");
      connection.off("ShopTyping");
      connection.off("CustomerTyping");
      connection.off("StaffTyping");
      connection.off("UserOnline");
      connection.off("UserOffline");
      connection.off("MessagesRead");
      connection.off("UserJoined");
      connection.off("UserLeft");
      connection.off("ConversationResolved");
      connection.off("ConversationReopened");
      connection.off("ParticipantAdded");
      connection.off("ParticipantRemoved");
      connection.off("NewMessageNotification");
    };
  }, [
    connection,
    messageHandlers,
    typingHandlers,
    presenceHandlers,
    readReceiptHandlers,
    conversationEventHandlers,
    notificationHandlers,
  ]);

  // Join/Leave conversations
  const joinConversation = useCallback(
    async (conversationId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke("JoinConversation", conversationId);
      }
    },
    [connection],
  );

  const leaveConversation = useCallback(
    async (conversationId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke("LeaveConversation", conversationId);
      }
    },
    [connection],
  );

  // Typing indicators
  const startTyping = useCallback(
    async (conversationId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke("StartTyping", conversationId);
      }
    },
    [connection],
  );

  const stopTyping = useCallback(
    async (conversationId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke("StopTyping", conversationId);
      }
    },
    [connection],
  );

  // Mark as read
  const markAsRead = useCallback(
    async (conversationId: string, messageIds: string[]) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke("MarkAsRead", conversationId, messageIds);
      }
    },
    [connection],
  );

  // Notify new message
  const notifyNewMessage = useCallback(
    async (conversationId: string, messageId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke("NotifyNewMessage", conversationId, messageId);
      }
    },
    [connection],
  );

  // Conversation status
  const resolveConversation = useCallback(
    async (conversationId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke("ConversationResolved", conversationId);
      }
    },
    [connection],
  );

  const reopenConversation = useCallback(
    async (conversationId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke("ConversationReopened", conversationId);
      }
    },
    [connection],
  );

  // Participant management
  const participantAdded = useCallback(
    async (conversationId: string, newParticipantId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke(
          "ParticipantAdded",
          conversationId,
          newParticipantId,
        );
      }
    },
    [connection],
  );

  const participantRemoved = useCallback(
    async (conversationId: string, removedParticipantId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke(
          "ParticipantRemoved",
          conversationId,
          removedParticipantId,
        );
      }
    },
    [connection],
  );

  // Event registration methods with proper types
  const onMessage = useCallback((handler: (data: NewMessageEvent) => void) => {
    setMessageHandlers((prev) => [...prev, handler]);
    return () =>
      setMessageHandlers((prev) => prev.filter((h) => h !== handler));
  }, []);

  const onTyping = useCallback(
    (handler: (data: TypingIndicatorEvent) => void) => {
      setTypingHandlers((prev) => [...prev, handler]);
      return () =>
        setTypingHandlers((prev) => prev.filter((h) => h !== handler));
    },
    [],
  );

  const onPresence = useCallback(
    (handler: (data: UserPresenceEvent & { isOnline: boolean }) => void) => {
      setPresenceHandlers((prev) => [...prev, handler]);
      return () =>
        setPresenceHandlers((prev) => prev.filter((h) => h !== handler));
    },
    [],
  );

  const onReadReceipt = useCallback(
    (handler: (data: ReadReceiptEvent) => void) => {
      setReadReceiptHandlers((prev) => [...prev, handler]);
      return () =>
        setReadReceiptHandlers((prev) => prev.filter((h) => h !== handler));
    },
    [],
  );

  const onConversationEvent = useCallback(
    (handler: (data: ConversationEvent) => void) => {
      setConversationEventHandlers((prev) => [...prev, handler]);
      return () =>
        setConversationEventHandlers((prev) =>
          prev.filter((h) => h !== handler),
        );
    },
    [],
  );

  const onNotification = useCallback(
    (handler: (data: NotificationEvent) => void) => {
      setNotificationHandlers((prev) => [...prev, handler]);
      return () =>
        setNotificationHandlers((prev) => prev.filter((h) => h !== handler));
    },
    [],
  );

  return {
    // State
    isConnected,
    onlineUsers,

    // Core methods
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    markAsRead,
    notifyNewMessage,
    resolveConversation,
    reopenConversation,
    participantAdded,
    participantRemoved,

    // Event listeners
    onMessage,
    onTyping,
    onPresence,
    onReadReceipt,
    onConversationEvent,
    onNotification,

    // Utility
    isUserOnline: useCallback(
      (userId: string) => onlineUsers.has(userId),
      [onlineUsers],
    ),
  };
};
