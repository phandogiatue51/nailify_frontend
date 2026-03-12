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

  const {
    isConnected: signalRConnected,
    onMessage,
    joinConversation,
    leaveConversation,
    notifyNewMessage,
    markAsRead: markAsReadSignalR,
  } = useSignalR();

  useEffect(() => {
    console.log("✅ COMPONENT MOUNTED");
    return () => {
      console.log("❌ COMPONENT UNMOUNTED");
      processedMessageIds.current.ids.clear();
      processedMessageIds.current.timestamps.clear();
      if (id) delete hasMarkedAsRead.current[id];
    };
  }, [id]);

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

  useEffect(() => {
    if (!isJoined || !id) return;

    console.log("📡 Setting up message listener for conversation:", id);

    const unsubscribe = onMessage((data) => {
      if (data.conversationId !== id) return;

      // Run cleanup occasionally
      if (processedMessageIds.current.ids.size % 20 === 0) {
        cleanupProcessedMessages();
      }

      if (processedMessageIds.current.ids.has(data.message.id)) {
        console.log("⚠️ Message already processed, skipping:", data.message.id);
        return;
      }

      processedMessageIds.current.ids.add(data.message.id);
      processedMessageIds.current.timestamps.set(data.message.id, Date.now());

      // CRITICAL FIX: Determine if this message is from the current user
      const isOwnMessage = data.message.senderId === user?.userId;

      console.log("📨 Received message:", {
        messageId: data.message.id,
        senderId: data.message.senderId,
        currentUserId: user?.userId,
        isOwn: isOwnMessage,
        content: data.message.content,
      });

      // Create message with correct ownership flag
      const messageWithOwnership = {
        ...data.message,
        isOwn: isOwnMessage, // This is the key fix!
      };

      // Add the message to the cache
      addMessage(messageWithOwnership);

      // Update conversation list with correct unread count
      queryClient.setQueryData(chatKeys.conversations(), (old: any[] = []) =>
        old.map((conv) =>
          conv.id === id
            ? {
                ...conv,
                lastMessage: data.message.content,
                lastMessageAt: data.message.sentAt,
                lastMessageSender: data.message.senderName,
                // Only increment unread if message is NOT from current user
                unreadCount: isOwnMessage
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
    user?.userId,
  ]);

  const markConversationAsRead = useCallback(() => {
    if (!id || !messages?.length || !isJoined) return;

    const now = Date.now();
    const lastMarked = lastMarkedAtRef.current[id] || 0;
    if (now - lastMarked < MARK_AS_READ_INTERVAL) return;

    // Use the same logic to determine unread messages
    const unreadMessageIds = messages
      .filter((m) => !m.isRead && m.senderId !== user?.userId) // Changed from !m.isOwn
      .map((m) => m.id);

    if (unreadMessageIds.length === 0) return;

    const latestMessageId = messages[messages.length - 1]?.id;
    if (lastProcessedMessageIdRef.current === latestMessageId) return;

    console.log("📖 Marking conversation as read:", id);
    lastMarkedAtRef.current[id] = now;
    lastProcessedMessageIdRef.current = latestMessageId;
    hasMarkedAsRead.current[id] = true;

    markAsRead.mutate(id, {
      onError: () => {
        lastMarkedAtRef.current[id] = 0;
        lastProcessedMessageIdRef.current = null;
      },
    });

    if (signalRConnected && unreadMessageIds.length > 0) {
      markAsReadSignalR(id, unreadMessageIds).catch(() => {});
    }
  }, [
    id,
    messages,
    isJoined,
    signalRConnected,
    markAsRead,
    markAsReadSignalR,
    user?.userId,
  ]);

  useEffect(() => {
    markConversationAsRead();
  }, [markConversationAsRead, messages, isJoined]);

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

  const handleMarkAsRead = useCallback(() => {
    if (!id) return;
    markConversationAsRead();
  }, [id, markConversationAsRead]);

  useEffect(() => {
    console.log(
      "🔌 SignalR:",
      signalRConnected ? "Connected" : "Disconnected",
      "| Joined:",
      isJoined ? "Yes" : "No",
    );
  }, [signalRConnected, isJoined]);

  return (
    <div className="bg-white min-h-screen">
      <MobileChatWindow
        conversationId={id!}
        conversation={conversation}
        messages={messages || []}
        onSendMessage={handleSend}
        isLoading={isLoading}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}
