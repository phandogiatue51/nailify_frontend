export type ChatStatus = 0 | 1 | 2; // 0: Active, 1: Resolved, 2: Closed
export type ConversationType = 0 | 1 | 2 | 3; // 0: Individual, 1: Group, 2: ShopCustomer, 3: System
export type ParticipantRole = 0 | 1 | 2 | 3 | 4 | 5; // 0: Owner, 1: Member, 2: Customer, 3: Staff, 4: Artist, 5: Support

export interface ChatConversationDto {
  id: string;
  conversationType: ConversationType;
  title: string;
  avatarUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string;
  lastMessageSender: string | null;
  unreadCount: number;
  status: ChatStatus;
  isCustomerFacing: boolean;
}

export interface ConversationDetailDto {
  id: string;
  ConversationType: ConversationType;
  profileId: string | null;
  title: string;
  avatarUrl: string | null;
  status: ChatStatus;
  createdAt: string;
  shopId: string | null;
  shopName: string | null;
  customerId: string | null;
  customerName: string | null;
  unreadCount: number;
  canResolve: boolean;
  canAddParticipants: boolean;
}

export interface MessageDto {
  id: string;
  content: string;
  sentAt: string;
  isSystemMessage: boolean;
  isOwn: boolean;
  senderName: string;
  senderAvatar: string | null;
  senderId: string | null;
  isFromShop: boolean;
  isFromCustomer: boolean;
  customerViewName: string | null;
  isRead: boolean;
}

export interface ParticipantDto {
  profileId: string;
  fullName: string;
  avatarUrl: string | null;
  role: ParticipantRole;
  isCustomerFacing: boolean;
  displayAsName: string | null;
  lastReadAt: string | null;
}

export interface NewMessageEvent {
  conversationId: string;
  message: MessageDto;
  type?: "shop" | "customer" | "staff";
  shopName?: string;
  sentBy?: string;
}

export interface TypingIndicatorEvent {
  conversationId: string;
  userId?: string;
  userName?: string;
  staffId?: string;
  staffName?: string;
  isTyping: boolean;
  type?: "shop" | "customer" | "staff";
}

export interface UserPresenceEvent {
  userId: string;
  connectionId: string;
  isOnline?: boolean;
}

export interface ReadReceiptEvent {
  conversationId: string;
  userId: string;
  messageIds?: string[];
  readAt: string;
}

export interface ConversationEvent {
  conversationId: string;
  type:
    | "joined"
    | "left"
    | "resolved"
    | "reopened"
    | "participantAdded"
    | "participantRemoved";
  userId?: string;
  userName?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  reopenedBy?: string;
  reopenedByName?: string;
  addedBy?: string;
  addedByName?: string;
  removedBy?: string;
  removedByName?: string;
  newParticipantId?: string;
  removedParticipantId?: string;
  resolvedAt?: string;
  reopenedAt?: string;
  addedAt?: string;
  removedAt?: string;
}

export interface UserJoinedEvent {
  conversationId: string;
  userId: string;
  connectionId: string;
}

export interface UserLeftEvent {
  conversationId: string;
  userId: string;
  connectionId: string;
}

export interface NotificationEvent {
  conversationId: string;
  conversationTitle: string;
  message: MessageDto;
  fromName: string;
}
