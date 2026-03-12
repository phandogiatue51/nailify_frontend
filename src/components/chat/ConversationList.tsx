// components/chat/ConversationList.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useConversations } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import DateDisplay from "../ui/date-display";
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

  const { conversations, isLoading } = useConversations(filter?.type);

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
    <div>
      {conversations.map((conv) => {
        const isSelected = selectedId === conv.id;
        const hasUnread = conv.unreadCount > 0;

        return (
          <button
            key={conv.id}
            onClick={() => onSelectConversation?.(conv.id)}
            className={cn(
              "w-full p-4 flex items-center gap-4 transition-all duration-300 rounded-[2rem]",
              isSelected
                ? "bg-white shadow-xl shadow-[#950101]/5 scale-[1.02] ring-1 ring-[#FFCFE9]"
                : "hover:bg-[#FFCFE9]/20 bg-transparent",
            )}
          >
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  "p-0.5 rounded-full transition-colors",
                  hasUnread ? "bg-[#950101]" : "bg-slate-200",
                )}
              >
                <div className="bg-white rounded-full p-0.5">
                  {conv?.avatarUrl ? (
                    <img
                      src={conv.avatarUrl}
                      className="w-12 h-12 rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full object-cover bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                      <span className="text-xl font-bold text-white uppercase">
                        {conv?.title?.[0] ?? "U"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {hasUnread && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#950101] border-2 border-white rounded-full" />
              )}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3
                  className={cn(
                    "font-black tracking-tight uppercase text-sm truncate transition-colors",
                    isSelected || hasUnread
                      ? "text-[#950101]"
                      : "text-slate-800",
                  )}
                >
                  {conv.title}
                </h3>
                <span className="text-[10px] font-medium text-slate-400 uppercase">
                  <DateDisplay dateString={conv.lastMessageAt} />
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <p
                  className={cn(
                    "text-xs truncate transition-all",
                    hasUnread
                      ? "text-slate-900 font-bold"
                      : "text-slate-500 font-medium",
                  )}
                >
                  {conv.lastMessage || "Click to start chatting..."}
                </p>

                {conv.unreadCount > 0 && (
                  <span className="px-2.5 py-1 text-[10px] font-black text-white rounded-full bg-[#950101] shadow-sm shadow-[#950101]/20">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
