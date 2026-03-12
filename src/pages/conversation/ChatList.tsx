// pages/chat/index.tsx
"use client";

import { ConversationList } from "@/components/chat/ConversationList";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
        <h1
          className="font-black tracking-tight uppercase text-xl bg-clip-text text-transparent pb-1"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          Danh sách cuộc trò chuyện
        </h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <ConversationList onSelectConversation={handleSelectConversation} />
      )}
    </div>
  );
}
