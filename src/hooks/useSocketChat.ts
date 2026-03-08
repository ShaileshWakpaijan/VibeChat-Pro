import { getSocket } from "@/lib/socket";
import { toastStyles } from "@/lib/ToastStyle";
import { MessageListResponse } from "@/lib/types/serverResponse";
import { useSession } from "next-auth/react";
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
        console.log(convId, data.conversationId);
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
        console.log(convId, message.conversationId);
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
          socket.on("convMsgStateDelivered", bulkMsgDeliveredHandler);

          //If Online Msg Bubble State Update
          socket.on("sentMsgConvDelivered", newMsgDeliveredHandler);
          clearInterval(interval);
        }
      }, 100);

      return () => {
        clearInterval(interval);
        const socket = getSocket();
        if (socket) {
          socket.off("convMsgStateDelivered", bulkMsgDeliveredHandler);
          socket.off("sentMsgConvDelivered", newMsgDeliveredHandler);
        }
      };
    }, [convId, setMessageList]);
  };

  return { sendMsg, msgStateDelivered };
};
export default useSocketChat;
