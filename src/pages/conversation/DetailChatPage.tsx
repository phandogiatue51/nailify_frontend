import { useParams } from "react-router-dom";
import {
  useConversation,
  useMessages,
  useSendMessage,
  useMarkAsRead,
} from "@/hooks/useChat";
import { MobileChatWindow } from "@/components/chat/MobileChatWindow";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSignalR } from "@/hooks/useSignalR";
import { useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/hooks/useChat";
import { useAuth } from "@/hooks/use-auth";

export default function DetailChatPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: conversation } = useConversation(id);
  const { messages, isLoading, addMessage } = useMessages(id);
  const sendMessage = useSendMessage(id);
  const markAsRead = useMarkAsRead();
  const [isJoined, setIsJoined] = useState(false);

  // Refs for tracking
  const hasMarkedAsRead = useRef<Record<string, boolean>>({});
  const lastMarkedAtRef = useRef<Record<string, number>>({});
  const lastProcessedMessageIdRef = useRef<string | null>(null);
  const MARK_AS_READ_INTERVAL = 5 * 1000; // 5 seconds

  const hasLoggedAuth = useRef(false);
  const { user, isAuthenticated } = useAuth();
  const token =
    localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");

  const processedMessageIds = useRef<{
    ids: Set<string>;
    timestamps: Map<string, number>;
  }>({
    ids: new Set(),
    timestamps: new Map(),
  });

  // Get SignalR hook
  const {
    isConnected: signalRConnected,
    onMessage,
    joinConversation,
    leaveConversation,
    notifyNewMessage,
    markAsRead: markAsReadSignalR,
  } = useSignalR();

  // ============ CLEANUP ============
  useEffect(() => {
    console.log("✅ COMPONENT MOUNTED");
    return () => {
      console.log("❌ COMPONENT UNMOUNTED");
      processedMessageIds.current.ids.clear();
      processedMessageIds.current.timestamps.clear();
      if (id) delete hasMarkedAsRead.current[id];
    };
  }, [id]);

  // ============ AUTH LOG ============
  useEffect(() => {
    if (!hasLoggedAuth.current) {
      console.log("🔐 Auth State:", {
        isAuthenticated: isAuthenticated(),
        user: user,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + "..." : null,
      });
      hasLoggedAuth.current = true;
    }
  }, []);

  // ============ JOIN CONVERSATION ============
  useEffect(() => {
    if (!id || !signalRConnected) return;

    console.log("📱 Joining conversation:", id);
    joinConversation(id).then(() => {
      console.log("✅ Joined conversation:", id);
      setIsJoined(true);
    });

    return () => {
      console.log("📱 Leaving conversation:", id);
      leaveConversation(id);
      setIsJoined(false);
    };
  }, [id, signalRConnected, joinConversation, leaveConversation]);

  // ============ CLEANUP PROCESSED MESSAGES ============
  const cleanupProcessedMessages = useCallback(() => {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    const maxSize = 100;

    const { ids, timestamps } = processedMessageIds.current;

    timestamps.forEach((timestamp, id) => {
      if (now - timestamp > maxAge) {
        ids.delete(id);
        timestamps.delete(id);
      }
    });

    if (ids.size > maxSize) {
      const sortedEntries = Array.from(timestamps.entries()).sort(
        (a, b) => a[1] - b[1],
      );
      const toRemove = sortedEntries.slice(0, ids.size - maxSize);
      toRemove.forEach(([id]) => {
        ids.delete(id);
        timestamps.delete(id);
      });
    }
  }, []);

  // ============ RECEIVE NEW MESSAGES ============
  useEffect(() => {
    if (!isJoined || !id) return;

    console.log("📡 Setting up message listener for conversation:", id);

    const unsubscribe = onMessage((data) => {
      if (data.conversationId !== id) return;

      // Run cleanup occasionally
      if (processedMessageIds.current.ids.size % 20 === 0) {
        cleanupProcessedMessages();
      }

      // Deduplicate
      if (processedMessageIds.current.ids.has(data.message.id)) {
        console.log("⚠️ Message already processed, skipping:", data.message.id);
        return;
      }

      // Mark as processed
      processedMessageIds.current.ids.add(data.message.id);
      processedMessageIds.current.timestamps.set(data.message.id, Date.now());

      // Add to cache
      addMessage(data.message);

      // Update conversation list
      queryClient.setQueryData(chatKeys.conversations(), (old: any[] = []) =>
        old.map((conv) =>
          conv.id === id
            ? {
                ...conv,
                lastMessage: data.message.content,
                lastMessageAt: data.message.sentAt,
                lastMessageSender: data.message.senderName,
                unreadCount: data.message.isOwn
                  ? conv.unreadCount
                  : (conv.unreadCount || 0) + 1,
              }
            : conv,
        ),
      );
    });

    return () => {
      console.log("📡 Cleaning up message listener");
      unsubscribe();
    };
  }, [
    id,
    isJoined,
    onMessage,
    addMessage,
    queryClient,
    cleanupProcessedMessages,
  ]);

  // ============ SINGLE SOURCE OF TRUTH FOR MARK AS READ ============
  const markConversationAsRead = useCallback(() => {
    if (!id || !messages?.length || !isJoined) return;

    // Throttle: once per 5 seconds
    const now = Date.now();
    const lastMarked = lastMarkedAtRef.current[id] || 0;
    if (now - lastMarked < MARK_AS_READ_INTERVAL) return;

    // Find unread messages
    const unreadMessageIds = messages
      .filter((m) => !m.isRead && !m.isOwn)
      .map((m) => m.id);

    if (unreadMessageIds.length === 0) return;

    // Don't mark if we already marked these messages
    const latestMessageId = messages[messages.length - 1]?.id;
    if (lastProcessedMessageIdRef.current === latestMessageId) return;

    console.log("📖 Marking conversation as read:", id);
    lastMarkedAtRef.current[id] = now;
    lastProcessedMessageIdRef.current = latestMessageId;
    hasMarkedAsRead.current[id] = true;

    // API call
    markAsRead.mutate(id, {
      onError: () => {
        // Reset on error so we can retry
        lastMarkedAtRef.current[id] = 0;
        lastProcessedMessageIdRef.current = null;
      },
    });

    // SignalR notification
    if (signalRConnected && unreadMessageIds.length > 0) {
      markAsReadSignalR(id, unreadMessageIds).catch(() => {});
    }
  }, [id, messages, isJoined, signalRConnected, markAsRead, markAsReadSignalR]);

  // Trigger mark as read when:
  // 1. Component mounts
  // 2. New messages arrive
  // 3. User joins conversation
  useEffect(() => {
    markConversationAsRead();
  }, [markConversationAsRead, messages, isJoined]);

  // ============ SEND MESSAGE ============
  const handleSend = async (content: string) => {
    try {
      const result = await sendMessage.mutateAsync(content);
      if (signalRConnected && result?.id) {
        await notifyNewMessage(id!, result.id);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // ============ HANDLE MARK AS READ (FROM UI) ============
  const handleMarkAsRead = useCallback(() => {
    if (!id) return;
    markConversationAsRead();
  }, [id, markConversationAsRead]);

  // ============ DEBUG ============
  useEffect(() => {
    console.log(
      "🔌 SignalR:",
      signalRConnected ? "Connected" : "Disconnected",
      "| Joined:",
      isJoined ? "Yes" : "No",
    );
  }, [signalRConnected, isJoined]);

  return (
    <div className="bg-slate-50/30">
      <MobileChatWindow
        conversationId={id!}
        conversation={conversation}
        messages={messages || []}
        onSendMessage={handleSend}
        isLoading={isLoading}
        onMarkAsRead={handleMarkAsRead}
      />
      {/* Connection status indicator */}
      <div className="fixed bottom-4 right-4 flex gap-2 text-xs bg-white p-2 rounded shadow z-50">
        <div className="flex items-center gap-1">
          <span
            className={`w-2 h-2 rounded-full ${
              signalRConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span>SignalR</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`w-2 h-2 rounded-full ${
              isJoined ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span>Conversation</span>
        </div>
      </div>
    </div>
  );
}
