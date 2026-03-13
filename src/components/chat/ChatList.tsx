"use client";

import useGetConversationList from "@/hooks/useGetConversationList";
import ChatItem from "./ChatItem";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ConversationListResponse } from "@/lib/types/serverResponse";
import ChatListSkeleton from "../skeletons/ChatListSkeleton";
import useSocketConversation from "@/hooks/useSocketConversation";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
let latestMessage: (updatedListItem: ConversationListResponse) => void;
let unReadMsgCountSetToZero: (conversationId: string | undefined) => void;

export default function ChatList() {
  const session = useSession();
  const getConversationList = useGetConversationList();
  const [conversationList, setConversationList] = useState<
    ConversationListResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { lastMsgStateDelivered } = useSocketConversation();
  const pathname = usePathname();
  const openedChatId = pathname.split("/chat/")[1];

  lastMsgStateDelivered(session?.data?.user?._id, setConversationList);
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

  latestMessage = (updatedListItem) => {
    setConversationList((prev) => {
      const myUserId = session?.data?.user?._id?.toString();

      const idx = prev.findIndex((c) => c._id === updatedListItem._id);
      const prevItem = idx >= 0 ? prev[idx] : undefined;

      const isSenderMe =
        myUserId &&
        updatedListItem.lastMessage?.sender?._id?.toString() === myUserId;
      const isOpened = openedChatId === updatedListItem._id;

      let newUnread = 1;
      if (isSenderMe || isOpened) {
        newUnread = 0;
      } else if (prevItem) {
        newUnread = (prevItem.unreadMsgNo || 0) + 1;
      }

      const newList = prev.filter((c) => c._id !== updatedListItem._id);

      return [
        {
          ...updatedListItem,
          unreadMsgNo: newUnread,
        },
        ...newList,
      ];
    });
  };

  unReadMsgCountSetToZero = (conversationId?: string) => {
    if (!conversationId) return;
    setConversationList((prev) =>
      prev.map((conv) =>
        conv._id === conversationId ? { ...conv, unreadMsgNo: 0 } : conv,
      ),
    );
  };

  useEffect(() => {
    getConversaionListFn();
  }, []);

  return loading ? (
    <ChatListSkeleton />
  ) : (
    <div className="w-full overflow-y-auto">
      {conversationList?.length == 0 && (
        <div className="h-full flex items-center justify-center text-gray-500">
          No conversation yet.
        </div>
      )}
      {conversationList?.length != 0 &&
        conversationList.map((chat, i) => (
          <Link key={chat._id} href={`/chat/${chat._id}`}>
            <ChatItem
              lastMessage={chat?.lastMessage}
              name={chat?.chatName}
              unreadMsgNo={chat?.unreadMsgNo}
              participants={chat?.participants}
            />
          </Link>
        ))}
    </div>
  );
}

export { latestMessage, unReadMsgCountSetToZero };
