import { Socket, Server } from "socket.io";
import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";
import { Types } from "mongoose";

export const handleMessageEvents = (io: Server, socket: Socket) => {
  socket.on(
    "sendMsg",
    async (data: { conversationId: string; content: string }) => {
      try {
        const { conversationId, content } = data;
        const sender = socket.data.userId;

        if (!content || content.trim() === "") return;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        if (
          !conversation.participants
            .map((p: Types.ObjectId) => p.toString())
            .includes(sender)
        )
          return;

        const message = await Message.create({
          conversationId,
          sender,
          content: content.trim(),
        });

        conversation.lastMessage = message._id;
        await conversation.save();

        io.to(`conversation:${conversationId}`).emit("receiveMsg", message);

        conversation.participants.forEach((participantId) => {
          if (participantId.toString() !== sender) {
            io.to(`user:${participantId.toString()}`).emit(
              "newMsgNotification",
              {
                conversationId,
                message,
              },
            );
          }
        });
      } catch (error) {
        console.log(`Some error in message controller: ${error}`);
        throw new Error(`Some error in message controller`);
      }
    },
  );
};
