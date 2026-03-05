import { getSocket } from "@/lib/socket";
import { toastStyles } from "@/lib/ToastStyle";
import { MessageListResponse } from "@/lib/types/serverResponse";
import { useEffect, useRef, useState } from "react";
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

  return { sendMsg };
};
export default useSocketChat;
