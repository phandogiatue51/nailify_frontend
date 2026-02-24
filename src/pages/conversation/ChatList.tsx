// pages/chat/index.tsx
"use client";

import { ConversationList } from "@/components/chat/ConversationList";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useConversations, useStartConversation } from "@/hooks/useChat";

export default function ChatList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const startConversation = useStartConversation();

  const { conversations, isLoading } = useConversations();

  const handleSelectConversation = (id: string) => {
    navigate(`/chat/${id}`);
  };

  useEffect(() => {
    const shopId = searchParams.get("shop");
    const userId = searchParams.get("user");
    const artistId = searchParams.get("artist");

    if (shopId) {
      startConversation.mutate({ type: "shop", id: shopId });
    } else if (userId || artistId) {
      startConversation.mutate({
        type: "individual",
        id: (userId || artistId)!,
      });
    }
  }, [searchParams, startConversation]);

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Conversations</h1>
      </div>

      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-gray-400">Loading messages...</div>
        </div>
      ) : (
        <ConversationList onSelectConversation={handleSelectConversation} />
      )}
    </div>
  );
}
