import { getSocket } from "@/lib/socket";
import { ConversationListResponse } from "@/lib/types/serverResponse";
import { Dispatch, SetStateAction, useEffect } from "react";

const useSocketConversation = (conversationId?: string) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const socket = getSocket();

      if (socket && socket.connected) {
        socket.emit("joinConversation", conversationId);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      const socket = getSocket();
      if (socket) {
        socket.emit("leaveConversation", conversationId);
      }
      clearInterval(interval);
    };
  }, [conversationId]);

  const lastMsgStateDelivered = (
    senderId: string | undefined,
    setConversationList: Dispatch<SetStateAction<ConversationListResponse[]>>,
  ) => {
    useEffect(() => {
      if (!senderId) return;

      const convListHandler = async (data: {
        _id: string;
        conversationId: string;
        sender: string;
        isLastMessage: boolean;
        status: "delivered";
      }) => {
        if (senderId !== data.sender) return;

        setConversationList((prev) =>
          prev.map((conv) =>
            conv._id === data.conversationId
              ? {
                  ...conv,
                  lastMessage: { ...conv.lastMessage, status: "delivered" },
                }
              : conv,
          ),
        );
      };

      const sentMsgHandler = async (message: {
        _id: string;
        conversationId: string;
        sender: string;
        status: "delivered";
      }) => {
        if (senderId !== message.sender) return;
        setConversationList((prev) =>
          prev.map((conv) =>
            conv._id === message.conversationId
              ? {
                  ...conv,
                  lastMessage: { ...conv.lastMessage, status: "delivered" },
                }
              : conv,
          ),
        );
      };

      const sentMsgReadHandler = async (message: {
        _id: string;
        conversationId: string;
        sender: string;
        status: "read";
      }) => {
        if (senderId !== message.sender) return;
        setConversationList((prev) =>
          prev.map((conv) =>
            conv._id === message.conversationId
              ? {
                  ...conv,
                  lastMessage: { ...conv.lastMessage, status: "read" },
                }
              : conv,
          ),
        );
      };

      const interval = setInterval(() => {
        const socket = getSocket();
        if (socket && socket.connected) {
          // After Login Conversation List Last Message State Update
          socket?.on("bulkConvListMsgStateDelivered", convListHandler);

          // If Online Conv List Msg State Update
          socket?.on("singleConvListLastMsgStateDelivered", sentMsgHandler);

          // If Online Conv List Msg State Update
          socket?.on("singleConvListLastMsgStateRead", sentMsgReadHandler);
          clearInterval(interval);
        }
      }, 100);

      return () => {
        clearInterval(interval);
        const socket = getSocket();
        if (socket) {
          socket?.off("bulkConvListMsgStateDelivered", convListHandler);
          socket?.off("singleConvListLastMsgStateDelivered", sentMsgHandler);
        }
      };
    }, [senderId, setConversationList]);
  };

  return { lastMsgStateDelivered };
};
export default useSocketConversation;
