"use client";

import useGetConversationList from "@/hooks/useGetConversationList";
import ChatItem from "./ChatItem";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ConversationListResponse } from "@/lib/types/serverResponse";
import ChatListSkeleton from "../skeletons/ChatListSkeleton";

export default function ChatList() {
  const getConversationList = useGetConversationList();
  const [conversationList, setConversationList] = useState<
    ConversationListResponse[]
  >([]);
  const [loading, setLoading] = useState(false);

  const getConversaionListFn = async () => {
    setLoading(true);
    try {
      const res = await getConversationList();
      setConversationList(res?.conversations);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to load conversation list", error);
    }
  };

  useEffect(() => {
    getConversaionListFn();
  }, []);

  return loading ? (
    <ChatListSkeleton />
  ) : (
    <div className="w-full overflow-y-auto">
      {conversationList?.length != 0 &&
        conversationList.map((chat, i) => (
          <Link key={chat._id} href={`/chat/${chat._id}`}>
            <ChatItem lastMessage={chat?.lastMessage} name={chat?.chatName} />
          </Link>
        ))}
    </div>
  );
}
