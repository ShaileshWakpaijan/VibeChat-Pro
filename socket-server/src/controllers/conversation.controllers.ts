import { Socket } from "socket.io";

export const handleConversationEvents = (socket: Socket) => {
  socket.on("joinConversation", (conversationId: string) => {
    if (!conversationId) return;
    socket.join(`conversation:${conversationId}`);
    console.log("User joined conversation: ", conversationId);
  });

  socket.on("leaveConversation", (conversationId: string) => {
    if (!conversationId) return;
    socket.leave(`conversation:${conversationId}`);
    console.log("User left conversation: ", conversationId);
  });
};
