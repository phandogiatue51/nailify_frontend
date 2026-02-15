// pages/chat/[id].tsx
import { useParams } from "react-router-dom";
import {
  useConversation,
  useMessages,
  useSendMessage,
  useMarkAsRead,
} from "@/hooks/useChat";
import { MobileChatWindow } from "@/components/chat/MobileChatWindow";
import { useEffect } from "react";

export default function DetailChatPage() {
  const { id } = useParams();
  const { data: conversation } = useConversation(id);
  const { messages, isLoading } = useMessages(id);
  const sendMessage = useSendMessage(id);
  const markAsRead = useMarkAsRead();

  useEffect(() => {
    if (id) {
      markAsRead.mutate(id);
    }
  }, [id]);

  const handleSend = async (content: string) => {
    await sendMessage.mutateAsync(content);
  };

  return (
    <div className="relative bg-slate-50/30 min-h-screen">
      <MobileChatWindow
        conversationId={id!}
        conversation={conversation}
        messages={messages}
        onSendMessage={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
}
