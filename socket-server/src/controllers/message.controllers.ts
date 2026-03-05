import { Socket, Server } from "socket.io";
import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";
import { Types } from "mongoose";
import "../models/User.js";

export const handleMessageEvents = (io: Server, socket: Socket) => {
  socket.on(
    "sendMsg",
    async (data: { conversationId: string; content: string }) => {
      try {
        const { conversationId, content } = data;
        const sender = socket.data.userId;

        if (!conversationId || !content || content.trim() === "") {
          console.error("[handleMessageEvents] Invalid data:", data);
          socket.emit(
            "errorMsg",
            "Invalid Conversation ID or Message content is missing",
          );
          return;
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          console.error("[handleMessageEvents] Conversation not found:");
          socket.emit("errorMsg", "Conversation not found");
          return;
        }

        if (
          !conversation.participants
            .map((p: Types.ObjectId) => p.toString())
            .includes(sender)
        ) {
          console.error("[handleMessageEvents] User is not a participant:");
          socket.emit(
            "errorMsg",
            "You are not a participant in this conversation",
          );
          return;
        }

        const message = await Message.create({
          conversationId,
          sender,
          content: content.trim(),
        });

        const populatedMsg = await message.populate("sender", "username");

        conversation.lastMessage = message._id;
        await conversation.save();

        io.to(`conversation:${conversationId}`).emit(
          "receiveMsg",
          populatedMsg,
        );

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
        socket.emit("errorMsg", "Failed to send message");
      }
    },
  );
};
