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
} from "@/types/chat";

export const useSignalR = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const connectionRef = useRef<HubConnection | null>(null);

  // Refs for handlers
  const messageHandlersRef = useRef<((data: NewMessageEvent) => void)[]>([]);
  const typingHandlersRef = useRef<((data: TypingIndicatorEvent) => void)[]>([]);
  const presenceHandlersRef = useRef<((data: UserPresenceEvent & { isOnline: boolean }) => void)[]>([]);
  const readReceiptHandlersRef = useRef<((data: ReadReceiptEvent) => void)[]>([]);
  const conversationEventHandlersRef = useRef<((data: ConversationEvent) => void)[]>([]);
  const notificationHandlersRef = useRef<((data: NotificationEvent) => void)[]>([]);

  const { isAuthenticated } = useAuth();

  const getToken = useCallback(() => {
    return (
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken")
    );
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token || !isAuthenticated()) {
      console.log("SignalR: No token or not authenticated");
      return;
    }

    console.log("SignalR: Initializing connection with token");

    // Use VITE_SIGNALR_URL or fallback to base URL without /api
    const signalrBaseUrl = import.meta.env.VITE_SIGNALR_URL;

    const hubUrl = `${signalrBaseUrl}/chatHub`;
    console.log("SignalR: Connecting to:", hubUrl);

    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Debug)
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
        console.log("✅ SignalR Connected successfully");
        console.log("Connection ID:", connection.connectionId);
      } catch (err) {
        console.error("❌ SignalR Connection Error:", err);
        // Log more details about the error
        if (err instanceof Error) {
          console.error("Error name:", err.name);
          console.error("Error message:", err.message);
          console.error("Error stack:", err.stack);
        }
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    // ============ MESSAGE EVENTS ============

    // Individual/Group chat messages
    connection.on("NewMessage", (data: any) => {
      console.log("📨 NewMessage received:", data);
      messageHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          message: data.message,
          type: "user"
        })
      );
    });

    // Shop messages (from staff to customer)
    connection.on("NewShopMessage", (data: any) => {
      console.log("🏪 NewShopMessage received:", data);
      messageHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          message: data.message,
          type: "shop",
          shopName: data.shopName
        })
      );
    });

    // Customer messages (to staff)
    connection.on("NewCustomerMessage", (data: any) => {
      console.log("👤 NewCustomerMessage received:", data);
      messageHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          message: data.message,
          type: "customer"
        })
      );
    });

    // Staff messages (to other staff)
    connection.on("NewStaffMessage", (data: any) => {
      console.log("👥 NewStaffMessage received:", data);
      messageHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          message: data.message,
          type: "staff",
          sentBy: data.sentBy
        })
      );
    });

    // ============ TYPING INDICATORS ============

    // Staff typing (notifies other staff and customers)
    connection.on("StaffTyping", (data: any) => {
      console.log("✏️ StaffTyping received:", data);
      typingHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          isTyping: data.isTyping,
          staffName: data.staffName,
          staffId: data.staffId,
          type: "staff"
        })
      );
    });

    // Customer typing (notifies staff)
    connection.on("CustomerTyping", (data: any) => {
      console.log("✏️ CustomerTyping received:", data);
      typingHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          isTyping: data.isTyping,
          type: "customer"
        })
      );
    });

    // Shop typing (notifies customer when staff is typing)
    connection.on("ShopTyping", (data: any) => {
      console.log("✏️ ShopTyping received:", data);
      typingHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          isTyping: data.isTyping,
          type: "shop"
        })
      );
    });

    // User typing (for individual/group chats)
    connection.on("UserTyping", (data: any) => {
      console.log("✏️ UserTyping received:", data);
      typingHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          isTyping: data.isTyping,
          userId: data.userId,
          userName: data.userName,
          type: "user"
        })
      );
    });

    // ============ PRESENCE EVENTS ============

    connection.on("UserOnline", (data: any) => {
      console.log("🟢 UserOnline received:", data);
      setOnlineUsers((prev) => new Set(prev).add(data.userId.toString()));
      presenceHandlersRef.current.forEach((handler) =>
        handler({ ...data, isOnline: true })
      );
    });

    connection.on("UserOffline", (data: any) => {
      console.log("🔴 UserOffline received:", data);
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId.toString());
        return newSet;
      });
      presenceHandlersRef.current.forEach((handler) =>
        handler({ ...data, isOnline: false })
      );
    });

    // ============ READ RECEIPTS ============

    connection.on("MessagesRead", (data: any) => {
      console.log("✓ MessagesRead received:", data);
      readReceiptHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          userId: data.userId,
          messageIds: data.messageIds,
          readAt: data.readAt
        })
      );
    });

    // ============ CONVERSATION EVENTS ============

    connection.on("UserJoined", (data: any) => {
      console.log("👋 UserJoined received:", data);
      conversationEventHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          type: "joined",
          userId: data.userId
        })
      );
    });

    connection.on("UserLeft", (data: any) => {
      console.log("👋 UserLeft received:", data);
      conversationEventHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          type: "left",
          userId: data.userId
        })
      );
    });

    connection.on("ConversationResolved", (data: any) => {
      console.log("✅ ConversationResolved received:", data);
      conversationEventHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          type: "resolved",
          resolvedBy: data.resolvedBy,
          resolvedByName: data.resolvedByName,
          resolvedAt: data.resolvedAt
        })
      );
    });

    connection.on("ConversationReopened", (data: any) => {
      console.log("🔄 ConversationReopened received:", data);
      conversationEventHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          type: "reopened",
          reopenedBy: data.reopenedBy,
          reopenedByName: data.reopenedByName,
          reopenedAt: data.reopenedAt
        })
      );
    });

    connection.on("ParticipantAdded", (data: any) => {
      console.log("➕ ParticipantAdded received:", data);
      conversationEventHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          type: "participantAdded",
          addedBy: data.addedBy,
          addedByName: data.addedByName,
          newParticipantId: data.newParticipantId,
          addedAt: data.addedAt
        })
      );
    });

    connection.on("ParticipantRemoved", (data: any) => {
      console.log("➖ ParticipantRemoved received:", data);
      conversationEventHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          type: "participantRemoved",
          removedBy: data.removedBy,
          removedByName: data.removedByName,
          removedParticipantId: data.removedParticipantId,
          removedAt: data.removedAt
        })
      );
    });

    // ============ NOTIFICATIONS ============

    connection.on("NewMessageNotification", (data: any) => {
      console.log("🔔 NewMessageNotification received:", data);
      notificationHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          conversationTitle: data.conversationTitle,
          message: data.message,
          fromName: data.fromName
        })
      );
    });

    // ============ CONNECTION STATE ============

    connection.onreconnecting(() => {
      setIsConnected(false);
      console.log("🔄 SignalR Reconnecting...");
    });

    connection.onreconnected(() => {
      setIsConnected(true);
      console.log("✅ SignalR Reconnected");
    });

    connection.onclose((error) => {
      setIsConnected(false);
      console.log("🔌 SignalR Connection closed", error);
    });

    // Cleanup
    return () => {
      connection.off("NewMessage");
      connection.off("NewShopMessage");
      connection.off("NewCustomerMessage");
      connection.off("NewStaffMessage");
      connection.off("StaffTyping");
      connection.off("CustomerTyping");
      connection.off("ShopTyping");
      connection.off("UserTyping");
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
  }, [connection]);

  // Event registration methods
  const onMessage = useCallback((handler: (data: NewMessageEvent) => void) => {
    messageHandlersRef.current = [...messageHandlersRef.current, handler];
    return () => {
      messageHandlersRef.current = messageHandlersRef.current.filter((h) => h !== handler);
    };
  }, []);

  const onTyping = useCallback((handler: (data: TypingIndicatorEvent) => void) => {
    typingHandlersRef.current = [...typingHandlersRef.current, handler];
    return () => {
      typingHandlersRef.current = typingHandlersRef.current.filter((h) => h !== handler);
    };
  }, []);

  const onPresence = useCallback((handler: (data: UserPresenceEvent & { isOnline: boolean }) => void) => {
    presenceHandlersRef.current = [...presenceHandlersRef.current, handler];
    return () => {
      presenceHandlersRef.current = presenceHandlersRef.current.filter((h) => h !== handler);
    };
  }, []);

  const onReadReceipt = useCallback((handler: (data: ReadReceiptEvent) => void) => {
    readReceiptHandlersRef.current = [...readReceiptHandlersRef.current, handler];
    return () => {
      readReceiptHandlersRef.current = readReceiptHandlersRef.current.filter((h) => h !== handler);
    };
  }, []);

  const onConversationEvent = useCallback((handler: (data: ConversationEvent) => void) => {
    conversationEventHandlersRef.current = [...conversationEventHandlersRef.current, handler];
    return () => {
      conversationEventHandlersRef.current = conversationEventHandlersRef.current.filter((h) => h !== handler);
    };
  }, []);

  const onNotification = useCallback((handler: (data: NotificationEvent) => void) => {
    notificationHandlersRef.current = [...notificationHandlersRef.current, handler];
    return () => {
      notificationHandlersRef.current = notificationHandlersRef.current.filter((h) => h !== handler);
    };
  }, []);

  // Invoke methods (updated to match server signatures)
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

  const markAsRead = useCallback(
    async (conversationId: string, messageIds: string[]) => {
      if (connection?.state === HubConnectionState.Connected) {
        // Convert string[] to Guid[] if needed
        const guidMessageIds = messageIds.map(id => id);
        await connection.invoke("MarkAsRead", conversationId, guidMessageIds);
      }
    },
    [connection],
  );

  const notifyNewMessage = useCallback(
    async (conversationId: string, messageId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke("NotifyNewMessage", conversationId, messageId);
      }
    },
    [connection],
  );

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

  const participantAdded = useCallback(
    async (conversationId: string, newParticipantId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke("ParticipantAdded", conversationId, newParticipantId);
      }
    },
    [connection],
  );

  const participantRemoved = useCallback(
    async (conversationId: string, removedParticipantId: string) => {
      if (connection?.state === HubConnectionState.Connected) {
        await connection.invoke("ParticipantRemoved", conversationId, removedParticipantId);
      }
    },
    [connection],
  );

  // Debug helper
  const debug = useCallback(() => {
    console.log({
      isConnected,
      connectionState: connection?.state,
      connectionId: connection?.connectionId,
      onlineUsers: Array.from(onlineUsers),
      messageHandlers: messageHandlersRef.current.length,
      typingHandlers: typingHandlersRef.current.length,
      presenceHandlers: presenceHandlersRef.current.length,
    });
  }, [connection, isConnected, onlineUsers]);

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

    // Debug
    debug,
  };
};