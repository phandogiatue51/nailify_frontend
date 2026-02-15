// @/hooks/useChat.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatAPI } from "@/services/api";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import {
  ChatConversationDto,
  MessageDto,
  ConversationDetailDto,
} from "@/types/chat"; // Add ConversationDetailDto

// Query keys
export const chatKeys = {
  all: ["chat"] as const,
  conversations: () => [...chatKeys.all, "conversations"] as const,
  conversation: (id: string) => [...chatKeys.conversations(), id] as const,
  messages: (conversationId: string) => ["messages", conversationId] as const,
  unread: () => ["unread"] as const,
  shopConversations: (shopId: string) =>
    ["shop", shopId, "conversations"] as const,
};

// Hook for conversation list
export const useConversations = (type?: number) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: [...chatKeys.conversations(), type],
    queryFn: async () => {
      if (!user) return [];
      try {
        return await chatAPI.getMyConversation();
      } catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
      }
    },
    enabled: !!user,
  });

  return {
    conversations,
    isLoading,
    // Helper to update unread count locally
    updateUnreadCount: (conversationId: string, count: number) => {
      queryClient.setQueryData(
        [...chatKeys.conversations(), type],
        (old: ChatConversationDto[] = []) =>
          old.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: count } : conv,
          ),
      );
    },
  };
};

// Hook for single conversation - THIS RETURNS ConversationDetailDto
export const useConversation = (conversationId: string | undefined) => {
  const { user } = useAuth();

  return useQuery<ConversationDetailDto | null>({
    // Add type here
    queryKey: chatKeys.conversation(conversationId!),
    queryFn: async () => {
      if (!conversationId) return null;
      try {
        return await chatAPI.getConversation(conversationId);
      } catch (error) {
        console.error("Error fetching conversation:", error);
        throw error;
      }
    },
    enabled: !!user && !!conversationId,
  });
};

// Rest of the hooks remain the same...
export const useMessages = (conversationId: string | undefined) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery<MessageDto[]>({
    queryKey: chatKeys.messages(conversationId!),
    queryFn: async () => {
      if (!conversationId) return [];
      try {
        return await chatAPI.getMessages(conversationId);
      } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
      }
    },
    enabled: !!user && !!conversationId,
  });

  // Function to add a message to the cache (for real-time updates)
  const addMessage = (newMessage: MessageDto) => {
    queryClient.setQueryData(
      chatKeys.messages(conversationId!),
      (old: MessageDto[] = []) => [...old, newMessage],
    );
  };

  return {
    messages,
    isLoading,
    addMessage,
  };
};

// Hook for sending messages
export const useSendMessage = (conversationId: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) throw new Error("No conversation ID");
      return await chatAPI.sendMessage(conversationId, content);
    },
    onSuccess: (newMessage) => {
      // Normalize the returned message so it's treated as 'own' when sent by current user.
      const normalized: MessageDto = {
        ...newMessage,
        isOwn: newMessage.senderId
          ? newMessage.senderId === user?.userId
          : true,
        senderName: newMessage.senderName || user?.fullName || "You",
      } as MessageDto;

      // Add message to cache
      queryClient.setQueryData(
        chatKeys.messages(conversationId!),
        (old: MessageDto[] = []) => [...old, normalized],
      );

      // Update last message in conversation list
      queryClient.setQueryData(
        chatKeys.conversations(),
        (old: ChatConversationDto[] = []) =>
          old.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  lastMessage: newMessage.content,
                  lastMessageAt: newMessage.sentAt,
                  lastMessageSender: "You",
                }
              : conv,
          ),
      );
    },
    onError: (error: any) => {
      toast({
        description: error?.message || "Failed to send message",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
};

export const useStartConversation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      id,
    }: {
      type: "individual" | "shop";
      id: string;
    }) => {
      if (type === "individual") {
        return await chatAPI.getOrCreateIndividualConversation(id);
      } else {
        return await chatAPI.getOrCreateShopCustomerConversation(id);
      }
    },
    onSuccess: (conversation) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      // Navigate to the new conversation
      navigate(`/chat/${conversation.id}`);
    },
    onError: (error: any) => {
      toast({
        description: error?.message || "Failed to start conversation",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
};

// Hook for marking conversation as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return await chatAPI.markAsRead(conversationId);
    },
    onSuccess: (_, conversationId) => {
      // Update unread count in conversation list
      queryClient.setQueryData(
        chatKeys.conversations(),
        (old: ChatConversationDto[] = []) =>
          old.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
          ),
      );

      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: chatKeys.unread() });
    },
    onError: (error: any) => {
      console.error("Failed to mark as read:", error);
    },
  });
};

// Hook for unread count
export const useUnreadCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: chatKeys.unread(),
    queryFn: async () => {
      if (!user) return 0;
      try {
        const data = await chatAPI.getUnreadCount();
        return data.count;
      } catch (error) {
        console.error("Error fetching unread count:", error);
        return 0;
      }
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Hook for shop conversations (for staff)
export const useShopConversations = (shopId: string | undefined) => {
  const { user, hasRole } = useAuth();

  return useQuery({
    queryKey: chatKeys.shopConversations(shopId!),
    queryFn: async () => {
      if (!shopId) return [];
      try {
        return await chatAPI.getShopConversations(shopId);
      } catch (error) {
        console.error("Error fetching shop conversations:", error);
        return [];
      }
    },
    enabled: !!shopId && !!user && hasRole([1, 3]), // ShopOwner or Manager
  });
};

// Hook for shop unread count
export const useShopUnreadCount = (shopId: string | undefined) => {
  const { user, hasRole } = useAuth();

  return useQuery({
    queryKey: [...chatKeys.shopConversations(shopId!), "unread"],
    queryFn: async () => {
      if (!shopId) return 0;
      try {
        const data = await chatAPI.getShopUnreadCount(shopId);
        return data.count;
      } catch (error) {
        console.error("Error fetching shop unread count:", error);
        return 0;
      }
    },
    enabled: !!shopId && !!user && hasRole([1, 3]),
    refetchInterval: 30000,
  });
};
