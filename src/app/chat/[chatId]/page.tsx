// app/chat/[chatId]/page.tsx
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatIdPage({ params }: { params: { chatId: string } }) {
  return <ChatWindow chatId={params.chatId} />;
}
