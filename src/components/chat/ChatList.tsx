'use client';

import ChatItem from './ChatItem';
import Link from 'next/link';

const dummyChats = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Alice' },
  { id: '3', name: 'Alice' },
  { id: '4', name: 'Alice' },
  { id: '5', name: 'Alice' },
  { id: '6', name: 'Alice' },
  { id: '7', name: 'Alice' },
  { id: '8', name: 'Alice' },
  { id: '9', name: 'Alice' },
  { id: '10', name: 'Alice' },
  { id: '11', name: 'Alice' },
  { id: '12', name: 'Alice' },
  { id: '13', name: 'Alice' },
  { id: '14', name: 'Alice' },
  { id: '15', name: 'Alice' },
  { id: '16', name: 'Alice' },
];

export default function ChatList() {
  return (
    <div className="w-full overflow-y-auto">
      {dummyChats.map(chat => (
        <Link key={chat.id} href={`/chat/${chat.id}`}>
          <ChatItem name={chat.name} />
        </Link>
      ))}
    </div>
  );
}
