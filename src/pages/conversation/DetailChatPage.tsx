// pages/chat/[id].tsx
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

export default function DetailChatPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: conversation } = useConversation(id);
  const { messages, isLoading, addMessage } = useMessages(id);
  const sendMessage = useSendMessage(id);
  const markAsRead = useMarkAsRead();
  const [isJoined, setIsJoined] = useState(false);
  const processedMessageIds = useRef<Set<string>>(new Set());
  const hasMarkedAsRead = useRef(false); // Track if we've already marked as read

  // Get SignalR hook
  const {
    isConnected: signalRConnected,
    onMessage,
    joinConversation,
    leaveConversation,
    notifyNewMessage,
    markAsRead: markAsReadSignalR,
  } = useSignalR();

  // Join conversation when component mounts and connection is ready
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

  // Listen for new messages
  useEffect(() => {
    if (!isJoined || !id) return;

    console.log("📡 Setting up message listener for conversation:", id);

    const unsubscribe = onMessage((data) => {
      console.log("📨 New message received in real-time:", data);

      if (data.conversationId === id) {
        // Check if we've already processed this message
        if (processedMessageIds.current.has(data.message.id)) {
          console.log("⚠️ Message already processed, skipping:", data.message.id);
          return;
        }

        // Mark as processed
        processedMessageIds.current.add(data.message.id);

        // Add message to cache
        addMessage(data.message);

        // Update conversation list
        queryClient.setQueryData(
          chatKeys.conversations(),
          (old: any[] = []) => {
            return old.map((conv) =>
              conv.id === id
                ? {
                  ...conv,
                  lastMessage: data.message.content,
                  lastMessageAt: data.message.sentAt,
                  lastMessageSender: data.message.senderName,
                  unreadCount: data.message.isOwn ? conv.unreadCount : (conv.unreadCount || 0) + 1,
                }
                : conv
            );
          }
        );
      }
    });

    return () => {
      console.log("📡 Cleaning up message listener");
      unsubscribe();
    };
  }, [id, isJoined, onMessage, addMessage, queryClient]);

  // Mark as read ONLY ONCE when component mounts
  useEffect(() => {
    if (!id || !messages || messages.length === 0) return;
    if (hasMarkedAsRead.current) return; // Only run once

    console.log("📖 Marking conversation as read on mount:", id);
    markAsRead.mutate(id, {
      onSuccess: () => {
        hasMarkedAsRead.current = true;
      }
    });

    // Also mark via SignalR if connected
    if (signalRConnected) {
      const unreadMessageIds = messages
        .filter(m => !m.isRead && !m.isOwn)
        .map(m => m.id);

      if (unreadMessageIds.length > 0) {
        markAsReadSignalR(id, unreadMessageIds);
      }
    }
  }, [id]); // Only depend on id, not messages or signalRConnected

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

  const handleMarkAsRead = useCallback((conversationId: string) => {
    // Only mark as read when user explicitly views/scrolls
    markAsRead.mutate(conversationId);

    if (signalRConnected && messages) {
      const unreadMessageIds = messages
        .filter(m => !m.isRead && !m.isOwn)
        .map(m => m.id);

      if (unreadMessageIds.length > 0) {
        markAsReadSignalR(conversationId, unreadMessageIds);
      }
    }
  }, [markAsRead, signalRConnected, markAsReadSignalR, messages]);

  // Debug connection
  useEffect(() => {
    console.log("🔌 SignalR Connection Status:", signalRConnected ? "Connected" : "Disconnected");
    console.log("📱 Joined Status:", isJoined ? "Joined" : "Not Joined");
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
          <span className={`w-2 h-2 rounded-full ${signalRConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>SignalR</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${isJoined ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span>Conversation</span>
        </div>
      </div>
    </div>
  );
}