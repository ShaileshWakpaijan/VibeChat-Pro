import { Socket, Server } from "socket.io";
import { msgReadUpdate } from "./message.controllers.js";

export const handleConversationEvents = (io: Server, socket: Socket) => {
  socket.on("joinConversation", (conversationId: string) => {
    if (!conversationId) return;
    socket.join(`conversation:${conversationId}`);
    console.log("User joined conversation: ", conversationId);
    msgReadUpdate(io, socket, conversationId);
  });

  socket.on("leaveConversation", (conversationId: string) => {
    if (!conversationId) return;
    socket.leave(`conversation:${conversationId}`);
    console.log("User left conversation: ", conversationId);
  });
};
