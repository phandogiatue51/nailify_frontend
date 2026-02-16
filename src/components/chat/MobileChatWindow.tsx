"use client";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, MoreVertical, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { MessageDto, ConversationDetailDto } from "@/types/chat";
import { useAuth } from "@/hooks/use-auth";

interface MobileChatWindowProps {
  conversationId: string; // This is defined but not being destructured
  conversation?: ConversationDetailDto;
  messages: MessageDto[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  onMarkAsRead?: (conversationId: string) => void;
}

export const MobileChatWindow = ({
  conversationId, // Add this to destructuring
  conversation,
  messages = [],
  onSendMessage,
  isLoading,
  onMarkAsRead,
}: MobileChatWindowProps) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isShop = user?.role === 1 || user?.role === 3;
  // Mark as read when component mounts
  useEffect(() => {
    if (conversationId && onMarkAsRead) {
      onMarkAsRead(conversationId);
    }
  }, [conversationId, onMarkAsRead]);

  // Mark as read when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      if (conversationId && onMarkAsRead) {
        onMarkAsRead(conversationId);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [conversationId, onMarkAsRead]);

  // Mark as read when new messages arrive (optional)
  useEffect(() => {
    if (conversationId && onMarkAsRead && messages.length > 0) {
      // Small delay to ensure messages are rendered
      const timer = setTimeout(() => {
        onMarkAsRead(conversationId);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [conversationId, messages.length, onMarkAsRead]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await onSendMessage(newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupedMessages = (messages || []).reduce(
    (groups, message) => {
      const date = formatDate(message.sentAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, MessageDto[]>,
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col bg-gray-50">
        {/* Conversation header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              {conversation?.title?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="font-medium">{conversation?.title}</h2>
            </div>
          </div>
          <button
            className="p-2 relative z-10"
            onClick={() => {
              switch (user?.role) {
                case 1: // ShopOwner
                case 4: // NailArtist
                  navigate(`/profile/${conversation?.profileId}/info`);
                  break;

                case 0: // Customer
                  if (conversation?.shopId) {
                    navigate(`/shop/${conversation.shopId}/info`);
                  } else {
                    navigate(`/profile/${conversation?.profileId}/info`);
                  }
                  break;

                case 2: // Admin
                case 3: // Manager
                default:
                  navigate(`/profile/${conversation?.profileId}/info`);
                  break;
              }
            }}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Messages - your existing JSX remains the same */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {(Object.entries(groupedMessages) as [string, MessageDto[]][]).map(
            ([date, dateMessages]) => (
              <div key={date}>
                <div className="flex justify-center mb-4">
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {date}
                  </span>
                </div>

                {dateMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} mb-2`}
                  >
                    {!msg.isOwn && (
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0 mr-2 mt-1 flex items-center justify-center text-xs">
                        {msg.senderName?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] ${msg.isOwn ? "items-end" : "items-start"}`}
                    >
                      {isShop && (
                        <div className="text-xs text-gray-500 mb-1 ml-1">
                          {msg.senderName}
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          msg.isOwn
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                        } ${msg.isSystemMessage ? "italic bg-gray-100 text-gray-500 text-center" : ""}`}
                      >
                        <div className="text-sm break-words">{msg.content}</div>
                        <div
                          className={`text-xs mt-1 ${msg.isOwn ? "text-blue-100" : "text-gray-400"}`}
                        >
                          {formatTime(msg.sentAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ),
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="sticky bottom-0 left-0 right-0 p-4 text-center bg-white border-t border-gray-200">
          <div className="flex items-end gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 max-h-32 resize-none border-0 focus:ring-0 p-2 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-full ${
                !newMessage.trim()
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-500 text-white"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
