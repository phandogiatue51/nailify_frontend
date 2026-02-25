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
  const [reconnectFailed, setReconnectFailed] = useState(false); // New state
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5; // Stop after 5 attempts
  const lastAuthFailRef = useRef<number | null>(null);
  const AUTH_FAILURE_COOLDOWN = 60 * 1000; // 1 minute

  // Refs for handlers
  const messageHandlersRef = useRef<((data: NewMessageEvent) => void)[]>([]);
  const typingHandlersRef = useRef<((data: TypingIndicatorEvent) => void)[]>(
    [],
  );
  const presenceHandlersRef = useRef<
    ((data: UserPresenceEvent & { isOnline: boolean }) => void)[]
  >([]);
  const readReceiptHandlersRef = useRef<((data: ReadReceiptEvent) => void)[]>(
    [],
  );
  const conversationEventHandlersRef = useRef<
    ((data: ConversationEvent) => void)[]
  >([]);
  const notificationHandlersRef = useRef<((data: NotificationEvent) => void)[]>(
    [],
  );

  const { isAuthenticated } = useAuth();

  const getToken = useCallback(() => {
    return (
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken")
    );
  }, []);

  // Add this right after setting up the connection in the first useEffect
  useEffect(() => {
    if (connectionRef.current) return;

    const token = getToken();
    if (!token || !isAuthenticated()) {
      console.log("SignalR: No token or not authenticated");
      return;
    }

    // Reset reconnect state when creating new connection
    reconnectAttemptsRef.current = 0;
    setReconnectFailed(false);

    const signalrBaseUrl = import.meta.env.VITE_SIGNALR_URL;
    const hubUrl = `${signalrBaseUrl}/chatHub`;

    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
        transport: 4,
      })
      .build();

    newConnection.onreconnecting((error) => {
      console.log("🔄 SignalR Reconnecting...", error);
      setIsConnected(false);
    });

    newConnection.onreconnected((connectionId) => {
      console.log("✅ SignalR Reconnected with ID:", connectionId);
      setIsConnected(true);
      setReconnectFailed(false); // Reset failed state on successful reconnect
      reconnectAttemptsRef.current = 0; // Reset attempts on success
    });

    newConnection.onclose((error) => {
      console.log("🔌 SignalR Connection closed", error);
      setIsConnected(false);

      // Check if we've exceeded max attempts
      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        console.log("❌ Max reconnection attempts reached, giving up");
        setReconnectFailed(true);
      }
    });

    // Start connection
    const startConnection = async () => {
      // Single attempt to start the connection. If it fails, mark reconnectFailed
      // and do NOT schedule further attempts. This prevents endless fetch loops
      // when the backend is down.
      try {
        await newConnection.start();
        console.log("✅ SignalR Connected successfully!");
        setIsConnected(true);
        setReconnectFailed(false);
        reconnectAttemptsRef.current = 0;
        lastAuthFailRef.current = null;
      } catch (err) {
        console.error("❌ SignalR Connection Error:", err);
        // Record whether this was an auth failure for visibility
        const msg =
          err && typeof err === "object" && "message" in err
            ? (err as any).message
            : String(err);
        if (/401|Unauthorized|authentication/i.test(msg)) {
          lastAuthFailRef.current = Date.now();
        }

        // Immediately give up - no retries
        setReconnectFailed(true);
        setIsConnected(false);
      }
    };

    startConnection();

    connectionRef.current = newConnection;
    setConnection(newConnection);

    return () => {
      try {
        // Best-effort stop
        connectionRef.current?.stop().catch(() => {});
      } finally {
        connectionRef.current = null;
        setConnection(null);
      }
    };
  }, [getToken, isAuthenticated]);

  // Expose a stop method so consumers can explicitly stop attempts and the
  // connection. Calling this will prevent any further connection activity
  // managed by this hook.
  const stop = useCallback(async () => {
    try {
      await connectionRef.current?.stop();
    } catch (e) {
      console.warn("SignalR: error while stopping connection", e);
    }
    connectionRef.current = null;
    setConnection(null);
    setIsConnected(false);
    setReconnectFailed(true);
  }, []);

  useEffect(() => {
    if (!connection) return;

    // Individual/Group chat messages
    connection.on("NewMessage", (data: any) => {
      console.log("📨 NewMessage received:", data);
      messageHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          message: data.message,
          type: "user",
        }),
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
          shopName: data.shopName,
        }),
      );
    });

    // Customer messages (to staff)
    connection.on("NewCustomerMessage", (data: any) => {
      console.log("👤 NewCustomerMessage received:", data);
      messageHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          message: data.message,
          type: "customer",
        }),
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
          sentBy: data.sentBy,
        }),
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
          type: "staff",
        }),
      );
    });

    // Customer typing (notifies staff)
    connection.on("CustomerTyping", (data: any) => {
      console.log("✏️ CustomerTyping received:", data);
      typingHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          isTyping: data.isTyping,
          type: "customer",
        }),
      );
    });

    // Shop typing (notifies customer when staff is typing)
    connection.on("ShopTyping", (data: any) => {
      console.log("✏️ ShopTyping received:", data);
      typingHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          isTyping: data.isTyping,
          type: "shop",
        }),
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
          type: "user",
        }),
      );
    });

    // ============ PRESENCE EVENTS ============

    connection.on("UserOnline", (data: any) => {
      console.log("🟢 UserOnline received:", data);
      setOnlineUsers((prev) => new Set(prev).add(data.userId.toString()));
      presenceHandlersRef.current.forEach((handler) =>
        handler({ ...data, isOnline: true }),
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
        handler({ ...data, isOnline: false }),
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
          readAt: data.readAt,
        }),
      );
    });

    // ============ CONVERSATION EVENTS ============

    connection.on("UserJoined", (data: any) => {
      console.log("👋 UserJoined received:", data);
      conversationEventHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          type: "joined",
          userId: data.userId,
        }),
      );
    });

    connection.on("UserLeft", (data: any) => {
      console.log("👋 UserLeft received:", data);
      conversationEventHandlersRef.current.forEach((handler) =>
        handler({
          conversationId: data.conversationId,
          type: "left",
          userId: data.userId,
        }),
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
          resolvedAt: data.resolvedAt,
        }),
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
          reopenedAt: data.reopenedAt,
        }),
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
          addedAt: data.addedAt,
        }),
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
          removedAt: data.removedAt,
        }),
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
          fromName: data.fromName,
        }),
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
      messageHandlersRef.current = messageHandlersRef.current.filter(
        (h) => h !== handler,
      );
    };
  }, []);

  const onTyping = useCallback(
    (handler: (data: TypingIndicatorEvent) => void) => {
      typingHandlersRef.current = [...typingHandlersRef.current, handler];
      return () => {
        typingHandlersRef.current = typingHandlersRef.current.filter(
          (h) => h !== handler,
        );
      };
    },
    [],
  );

  const onPresence = useCallback(
    (handler: (data: UserPresenceEvent & { isOnline: boolean }) => void) => {
      presenceHandlersRef.current = [...presenceHandlersRef.current, handler];
      return () => {
        presenceHandlersRef.current = presenceHandlersRef.current.filter(
          (h) => h !== handler,
        );
      };
    },
    [],
  );

  const onReadReceipt = useCallback(
    (handler: (data: ReadReceiptEvent) => void) => {
      readReceiptHandlersRef.current = [
        ...readReceiptHandlersRef.current,
        handler,
      ];
      return () => {
        readReceiptHandlersRef.current = readReceiptHandlersRef.current.filter(
          (h) => h !== handler,
        );
      };
    },
    [],
  );

  const onConversationEvent = useCallback(
    (handler: (data: ConversationEvent) => void) => {
      conversationEventHandlersRef.current = [
        ...conversationEventHandlersRef.current,
        handler,
      ];
      return () => {
        conversationEventHandlersRef.current =
          conversationEventHandlersRef.current.filter((h) => h !== handler);
      };
    },
    [],
  );

  const onNotification = useCallback(
    (handler: (data: NotificationEvent) => void) => {
      notificationHandlersRef.current = [
        ...notificationHandlersRef.current,
        handler,
      ];
      return () => {
        notificationHandlersRef.current =
          notificationHandlersRef.current.filter((h) => h !== handler);
      };
    },
    [],
  );

  // Invoke methods (updated to match server signatures)
  // Use connectionRef.current inside callbacks so these functions are stable
  // and won't change identity when `connection` state object changes.
  const joinConversation = useCallback(async (conversationId: string) => {
    const conn = connectionRef.current;
    if (conn?.state === HubConnectionState.Connected) {
      await conn.invoke("JoinConversation", conversationId);
    }
  }, []);

  const leaveConversation = useCallback(async (conversationId: string) => {
    const conn = connectionRef.current;
    if (conn?.state === HubConnectionState.Connected) {
      await conn.invoke("LeaveConversation", conversationId);
    }
  }, []);

  const startTyping = useCallback(async (conversationId: string) => {
    const conn = connectionRef.current;
    if (conn?.state === HubConnectionState.Connected) {
      await conn.invoke("StartTyping", conversationId);
    }
  }, []);

  const stopTyping = useCallback(async (conversationId: string) => {
    const conn = connectionRef.current;
    if (conn?.state === HubConnectionState.Connected) {
      await conn.invoke("StopTyping", conversationId);
    }
  }, []);

  const markAsRead = useCallback(
    async (conversationId: string, messageIds: string[]) => {
      const conn = connectionRef.current;
      if (conn?.state === HubConnectionState.Connected) {
        // Convert string[] to Guid[] if needed
        const guidMessageIds = messageIds.map((id) => id);
        await conn.invoke("MarkAsRead", conversationId, guidMessageIds);
      }
    },
    [],
  );

  const notifyNewMessage = useCallback(
    async (conversationId: string, messageId: string) => {
      const conn = connectionRef.current;
      if (conn?.state === HubConnectionState.Connected) {
        await conn.invoke("NotifyNewMessage", conversationId, messageId);
      }
    },
    [],
  );

  const resolveConversation = useCallback(async (conversationId: string) => {
    const conn = connectionRef.current;
    if (conn?.state === HubConnectionState.Connected) {
      await conn.invoke("ConversationResolved", conversationId);
    }
  }, []);

  const reopenConversation = useCallback(async (conversationId: string) => {
    const conn = connectionRef.current;
    if (conn?.state === HubConnectionState.Connected) {
      await conn.invoke("ConversationReopened", conversationId);
    }
  }, []);

  const participantAdded = useCallback(
    async (conversationId: string, newParticipantId: string) => {
      const conn = connectionRef.current;
      if (conn?.state === HubConnectionState.Connected) {
        await conn.invoke("ParticipantAdded", conversationId, newParticipantId);
      }
    },
    [],
  );

  const participantRemoved = useCallback(
    async (conversationId: string, removedParticipantId: string) => {
      const conn = connectionRef.current;
      if (conn?.state === HubConnectionState.Connected) {
        await conn.invoke(
          "ParticipantRemoved",
          conversationId,
          removedParticipantId,
        );
      }
    },
    [],
  );

  // Debug helper
  const debug = useCallback(() => {
    console.log({
      isConnected,
      connectionState: connectionRef.current?.state,
      connectionId: connectionRef.current?.connectionId,
      onlineUsers: Array.from(onlineUsers),
      messageHandlers: messageHandlersRef.current.length,
      typingHandlers: typingHandlersRef.current.length,
      presenceHandlers: presenceHandlersRef.current.length,
    });
  }, [isConnected, onlineUsers]);

  return {
    // State
    isConnected,
    onlineUsers,
    reconnectFailed,
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
