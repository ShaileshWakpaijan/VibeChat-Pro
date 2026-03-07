import { Socket, Server } from "socket.io";
import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";
import { Types } from "mongoose";
import "../models/User.js";
import { ConversationListResponse } from "../lib/types.js";

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

        let argConversation:
          | ConversationListResponse[]
          | ConversationListResponse = await Conversation.aggregate([
          {
            $match: {
              _id: new Types.ObjectId(conversationId),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "participants",
              foreignField: "_id",
              as: "participants",
              pipeline: [
                {
                  $project: {
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "messages",
              localField: "lastMessage",
              foreignField: "_id",
              as: "lastMessage",
              pipeline: [
                {
                  $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "sender",
                    pipeline: [
                      {
                        $project: {
                          username: 1,
                        },
                      },
                    ],
                  },
                },
                { $unwind: "$sender" },
                {
                  $project: {
                    content: 1,
                    sender: 1,
                    status: 1,
                    createdAt: 1,
                  },
                },
              ],
            },
          },
          { $unwind: "$lastMessage" },
          {
            $addFields: {
              chatName: {
                $cond: {
                  if: { $eq: ["$type", "group"] },
                  then: "$groupName",
                  else: "",
                },
              },
            },
          },
        ]);
        argConversation = argConversation[0];

        argConversation.participants.forEach((p) => {
          if (argConversation.chatName) {
            io.to(`user:${p._id.toString()}`).emit(
              "newMsgNotification",
              argConversation,
            );
          } else {
            argConversation.chatName =
              p._id === argConversation.participants[0]._id
                ? argConversation.participants[1].username
                : argConversation.participants[0].username;
          }
          io.to(`user:${p._id.toString()}`).emit(
            "newMsgNotification",
            argConversation,
          );
          argConversation.chatName = "";
        });
      } catch (error) {
        console.error(`Some error in message controller: ${error}`);
        socket.emit("errorMsg", "Failed to send message");
      }
    },
  );
};
