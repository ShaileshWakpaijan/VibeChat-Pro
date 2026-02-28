import { Socket } from "socket.io";

export const handleConversationEvents = (socket: Socket) => {
  socket.on("joinConversation", (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
    console.log("User joined conversation: ", conversationId);
  });

  socket.on("leaveConversation", (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`);
    console.log("User left conversation: ", conversationId);
  });
};
