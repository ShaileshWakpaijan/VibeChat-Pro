"use client";

import MessageBubble from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "./ChatInput";
import ChatHeader from "./ChatHeader";
import useLoadConversationMsg from "@/hooks/useLoadConversationMsg";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ConversationResponse,
  MessageListResponse,
} from "@/lib/types/serverResponse";
import { useSession } from "next-auth/react";
import ChatWindowSkeleton from "../skeletons/ChatWindowSkeleton";
import ChatHeaderSkeleton from "../skeletons/ChatHeaderSkeleton";

export default function ChatWindow() {
  const { chatId }: { chatId: string } = useParams();
  const loadConversationMsg = useLoadConversationMsg();
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [messageList, setMessageList] = useState<MessageListResponse[]>([]);
  const [conversationInfo, setConversationInfo] =
    useState<ConversationResponse | null>(null);

  const loadConversationMsgFn = async () => {
    setLoading(true);
    try {
      const res = await loadConversationMsg(chatId);
      setMessageList(res?.messages);
      setConversationInfo(res?.conversation);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to load conversation list", error);
    }
  };

  useEffect(() => {
    loadConversationMsgFn();
  }, []);

  return (
    <div className="md:px-4 flex flex-col relative h-[calc(100vh-4.8rem)]">
      {/* Header */}
      {loading ? (
        <ChatHeaderSkeleton />
      ) : (
        conversationInfo && <ChatHeader name={conversationInfo?.chatName} />
      )}

      {/* Scrollable Message Area */}
      {loading ? (
        <ChatWindowSkeleton />
      ) : (
        <ScrollArea className=" h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)]">
          <div className="flex flex-col py-3">
            {messageList?.length != 0 &&
              messageList.map((msg, i) => (
                <MessageBubble
                  key={msg._id}
                  text={msg.content}
                  isSender={session?.data?.user?._id == msg.sender._id}
                  time={msg.createdAt}
                />
              ))}
          </div>
        </ScrollArea>
      )}

      {/* Footer/Input Placeholder */}
      <div className="mt-1 px-4 h-14 fixed md:static bottom-3 w-full md:py-2 md:border-t">
        <ChatInput />
      </div>
    </div>
  );
}
