// components/TestSignalR.tsx
import { useEffect } from 'react';
import { useSignalR } from '@/hooks/useSignalR';

export const TestSignalR = () => {
  const { 
    isConnected, 
    onMessage, 
    onTyping,
    onPresence,
    joinConversation,
    onlineUsers 
  } = useSignalR();

  useEffect(() => {
    console.log('🔌 SignalR Connection State:', isConnected ? 'Connected' : 'Disconnected');
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) return;

    console.log('📡 Setting up message handlers...');

    // Listen for messages
    const unsubscribeMessage = onMessage((data) => {
      console.log('💬 New Message Received:', data);
    });

    // Listen for typing indicators
    const unsubscribeTyping = onTyping((data) => {
      console.log('✏️ Typing Indicator:', data);
    });

    // Listen for presence changes
    const unsubscribePresence = onPresence((data) => {
      console.log('🟢 Presence Change:', data);
    });

    // Test joining a conversation (replace with actual conversation ID)
    const testConversationId = 'test-conversation-123';
    joinConversation(testConversationId).then(() => {
      console.log('✅ Joined conversation:', testConversationId);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribePresence();
    };
  }, [isConnected, onMessage, onTyping, onPresence, joinConversation]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>SignalR Test Component</h3>
      <p>Status: <strong>{isConnected ? '🟢 Connected' : '🔴 Disconnected'}</strong></p>
      <p>Online Users: {onlineUsers.size}</p>
      <button onClick={() => console.log('Current online users:', Array.from(onlineUsers))}>
        Log Online Users
      </button>
    </div>
  );
};