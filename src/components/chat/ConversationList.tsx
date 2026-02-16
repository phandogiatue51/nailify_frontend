// components/chat/ConversationList.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useConversations } from "@/hooks/useChat";

interface ConversationListProps {
  onSelectConversation?: (conversationId: string) => void;
  selectedId?: string | null;
  filter?: {
    type?: number;
  };
}

export const ConversationList = ({
  onSelectConversation,
  selectedId,
  filter,
}: ConversationListProps) => {
  const { user } = useAuth();

  // Use the React Query hook instead of internal state
  const { conversations, isLoading } = useConversations(filter?.type);

  const getAvatarText = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (diffInHours < 48) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString();
      }
    } catch {
      return "";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <span className="text-2xl">💬</span>
        </div>
        <div className="text-gray-500 mb-2">No conversations yet</div>
        <div className="text-sm text-gray-400">
          {user?.role === 0
            ? "Start chatting with a shop to book appointments"
            : "Your conversations will appear here"}
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelectConversation?.(conv.id)}
          className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
            selectedId === conv.id ? "bg-blue-50" : ""
          }`}
        >
          {/* Avatar */}
          <div className="flex-shrink-0">
            {conv.avatarUrl ? (
              <img
                src={conv.avatarUrl}
                alt={conv.title}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                {getAvatarText(conv.title)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium text-gray-900 truncate">
                {conv.title}
                {conv.isCustomerFacing && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                    Customer
                  </span>
                )}
              </h3>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                {formatTime(conv.lastMessageAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              {conv.lastMessage && (
                <p className="text-sm text-gray-600 truncate">
                  {conv.lastMessageSender && (
                    <span className="text-gray-400">
                      {conv.lastMessageSender}:{" "}
                    </span>
                  )}
                  {conv.lastMessage}
                </p>
              )}

              {conv.unreadCount > 0 && (
                <div>
                  <span className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full min-w-[20px]">
                    {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
