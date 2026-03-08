import { getSocket } from "@/lib/socket";
import { toastStyles } from "@/lib/ToastStyle";
import { MessageListResponse } from "@/lib/types/serverResponse";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { toast } from "sonner";

const useSocketChat = (onReceive?: (message: MessageListResponse) => void) => {
  const cbRef = useRef(onReceive);
  cbRef.current = onReceive;
  useEffect(() => {
    const interval = setInterval(() => {
      const socket = getSocket();

      if (socket && socket.connected) {
        socket.on("receiveMsg", (message: MessageListResponse) => {
          if (cbRef.current) cbRef.current(message);
        });
        clearInterval(interval);
      }
    }, 100);

    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off("receiveMsg");
      }
      clearInterval(interval);
    };
  }, []);

  const sendMsg = async (conversationId: string, content: string) => {
    const socket = getSocket();
    if (!socket || !socket.connected) {
      toast.error("Not connected. Message not sent.", {
        style: toastStyles.danger as React.CSSProperties,
      });
      return;
    }

    socket?.emit("sendMsg", { conversationId, content });
  };

  const msgStateDelivered = async (
    convId: string | undefined,
    setMessageList: Dispatch<SetStateAction<MessageListResponse[]>>,
  ) => {
    useEffect(() => {
      const bulkMsgDeliveredHandler = async (data: {
        conversationId: string;
        msgIds: string[];
        status: "delivered";
      }) => {
        if (convId !== data.conversationId) return;

        const idSet = new Set(data.msgIds);
        setMessageList((prev) =>
          prev.map((m) =>
            idSet.has(m._id) ? { ...m, status: data.status } : m,
          ),
        );
      };

      const newMsgDeliveredHandler = (message: {
        _id: string;
        conversationId: string;
        sender: string;
        status: "delivered";
      }) => {
        if (convId !== message.conversationId) return;

        const idSet = new Set([message._id]);
        setMessageList((prev) =>
          prev.map((m) =>
            idSet.has(m._id) ? { ...m, status: message.status } : m,
          ),
        );
      };

      const interval = setInterval(() => {
        const socket = getSocket();
        if (socket && socket.connected) {
          //After Login Msg Bubble State Update
          socket.on("bulkMsgBubbleStateDelivered", bulkMsgDeliveredHandler);

          //If Online Msg Bubble State Update
          socket.on("singleMsgBubbleStateDelivered", newMsgDeliveredHandler);
          clearInterval(interval);
        }
      }, 100);

      return () => {
        clearInterval(interval);
        const socket = getSocket();
        if (socket) {
          socket.off("bulkMsgBubbleStateDelivered", bulkMsgDeliveredHandler);
          socket.off("singleMsgBubbleStateDelivered", newMsgDeliveredHandler);
        }
      };
    }, [convId, setMessageList]);
  };

  const msgStateRead = async (
    convId: string | undefined,
    setMessageList: Dispatch<SetStateAction<MessageListResponse[]>>,
  ) => {
    useEffect(() => {
      const bulkMsgReadHandler = async (data: {
        conversationId: string;
        msgIds: string[];
        status: "read";
      }) => {
        if (convId !== data.conversationId) return;

        const idSet = new Set(data.msgIds);
        setMessageList((prev) =>
          prev.map((m) =>
            idSet.has(m._id) ? { ...m, status: data.status } : m,
          ),
        );
      };

      const newMsgReadHandler = (message: {
        _id: string;
        conversationId: string;
        sender: string;
        status: "read";
      }) => {
        if (convId !== message.conversationId) return;

        const idSet = new Set([message._id]);
        setMessageList((prev) =>
          prev.map((m) =>
            idSet.has(m._id) ? { ...m, status: message.status } : m,
          ),
        );
      };

      const interval = setInterval(() => {
        const socket = getSocket();
        if (socket && socket.connected) {
          //After Open Chat Msg Bubble State Update
          socket.on("bulkMsgBubbleStateRead", bulkMsgReadHandler);

          //If Chat Opened Msg Bubble State Update
          socket.on("singleMsgBubbleStateRead", newMsgReadHandler);
          clearInterval(interval);
        }
      }, 100);

      return () => {
        clearInterval(interval);
        const socket = getSocket();
        if (socket) {
          socket.off("bulkMsgBubbleStateRead", bulkMsgReadHandler);
          socket.off("singleMsgBubbleStateRead", newMsgReadHandler);
        }
      };
    }, [convId, setMessageList]);
  };

  return { sendMsg, msgStateDelivered, msgStateRead };
};
export default useSocketChat;
