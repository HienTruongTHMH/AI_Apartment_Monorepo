import ChatManager from '@/components/features/chat/ChatManager';

export default function TenantChatPage() {
  return (
    <div className="p-6">
      <ChatManager role="tenant" />
    </div>
  );
}
