import { getSocket } from "@/lib/socket";
import { useEffect } from "react";

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
};
export default useSocketConversation;
