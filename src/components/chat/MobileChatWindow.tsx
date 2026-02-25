"use client";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, MoreVertical, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { MessageDto, ConversationDetailDto } from "@/types/chat";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
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
    // Change h-screen to fixed inset-0 to prevent body bounce/double scroll
    <div className="fixed inset-0 flex flex-col bg-slate-50 overflow-hidden">
      {/* HEADER: No changes needed to logic, just ensure it's relative/sticky within flex */}
      <header className="flex-shrink-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-[#FFCFE9]/30 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#950101]" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#FFCFE9] flex items-center justify-center text-[#950101] font-black border border-[#950101]/10 shadow-inner text-sm">
              {conversation?.title?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-md tracking-tight leading-tight">
                {conversation?.title}
              </h2>
            </div>
          </div>
        </div>
        <button
          className="p-2 text-slate-400"
          onClick={() => {
            switch (user?.role) {
              case 1: // ShopOwner

              case 3: // Manager
                // Pass the shopId from user claims

                navigate(`/profile/${conversation?.profileId}/info`, {
                  state: {
                    shopId: user.shopId, // This comes from the decoded JWT

                    userRole: user.role,
                  },
                });

                break;

              case 0: // Customer
                if (conversation?.shopId) {
                  navigate(`/shop/${conversation.shopId}/info`);
                } else {
                  navigate(`/profile/${conversation?.profileId}/info`);
                }

                break;

              case 2: // Admin
                navigate(`/profile/${conversation?.profileId}/info`, {
                  state: {
                    userRole: user.role,
                  },
                });

                break;

              case 4: // NailArtist
                navigate(`/profile/${conversation?.profileId}/info`, {
                  state: {
                    nailArtistId: user.nailArtistId, // This comes from the decoded JWT

                    userRole: user.role,
                  },
                });

                break;

              default:
                navigate(`/profile/${conversation?.profileId}/info`);

                break;
            }
          }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* MESSAGES AREA: flex-1 makes this take all available middle space */}
      <main className="flex-1 overflow-y-auto p-4 scroll-smooth">
        {(Object.entries(groupedMessages) as [string, MessageDto[]][]).map(
          ([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center">
                <span className="text-[10px] font-black bg-slate-200/50 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">
                  {date}
                </span>
              </div>

              {dateMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end",
                    msg.isOwn ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <div className="flex flex-col max-w-[80%]">
                    {isShop && !msg.isOwn && (
                      <p className="text-[12px] font-bold text-slate-400 mb-1 ml-3">
                        {msg.senderName}
                      </p>
                    )}

                    <div
                      className={cn(
                        "rounded-[1.5rem] px-4 py-2 shadow-sm text-sm",
                        msg.isOwn
                          ? "bg-[#950101] text-white rounded-br-none"
                          : "bg-white text-slate-700 rounded-bl-none border border-slate-100",
                      )}
                    >
                      <p className="font-medium leading-relaxed">{msg.content}</p>
                      <p
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-tighter opacity-70",
                          msg.isOwn ? "text-right" : "text-left",
                        )}
                      >
                        {formatTime(msg.sentAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ),
        )}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* FOOTER: Flex-shrink-0 ensures it stays at the bottom */}
      <footer className="flex-shrink-0 bg-white border-t border-slate-100 p-4 pb-6">
        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-slate-50 rounded-[1.5rem] p-2 pr-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#950101] transition-all">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Write a message..."
            rows={1}
            className="flex-1 max-h-32 resize-none bg-transparent border-0 p-2 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={cn(
              "p-2.5 rounded-2xl transition-all active:scale-90 shrink-0",
              !newMessage.trim()
                ? "bg-slate-200 text-slate-400"
                : "bg-[#950101] text-white shadow-lg shadow-[#950101]/20",
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
      <div className="h-16 flex-shrink-0" />
    </div>
  );
};
