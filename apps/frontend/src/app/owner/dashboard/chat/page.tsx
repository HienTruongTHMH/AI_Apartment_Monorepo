import ChatManager from '@/components/features/chat/ChatManager';

export default function OwnerChatPage() {
  return (
    <div className="p-6">
      <ChatManager role="owner" />
    </div>
  );
}
