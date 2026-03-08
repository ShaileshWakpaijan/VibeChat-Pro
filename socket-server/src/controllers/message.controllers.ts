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

  //After Receiving New Message If Online
  socket.on("recvMsgDelivered", async (messageId: string) => {
    if (!messageId) return;

    let message = await Message.findById(messageId);
    if (!message) return;

    if (message.status === "delivered" || message.status === "read") return;
    if (message.sender.toString() === socket.data.userId) return;

    message.status = "delivered";
    await message.save().catch((e) => console.error("deliver save err", e));

    //After Message Sent If Receiver Online: Conversation List Last Message State Update
    io.to(`user:${message.sender.toString()}`).emit(
      "singleConvListLastMsgStateDelivered",
      {
        _id: message._id.toString(),
        conversationId: message.conversationId.toString(),
        sender: message.sender.toString(),
        status: "delivered",
      },
    );

    //After Message Sent If Receiver Online: Message Bubble State Update
    io.to(`conversation:${message.conversationId.toString()}`).emit(
      "singleMsgBubbleStateDelivered",
      {
        _id: message._id.toString(),
        conversationId: message.conversationId.toString(),
        sender: message.sender.toString(),
        status: "delivered",
      },
    );
  });
};

export const msgDeliveredUpdate = async (io: Server, socket: Socket) => {
  try {
    const msgList: {
      _id: string;
      conversationId: string;
      sender: string;
      isLastMessage: boolean;
    }[] = await Message.aggregate([
      {
        $match: {
          status: "sent",
          sender: { $ne: new Types.ObjectId(socket.data.userId) },
        },
      },
      {
        $lookup: {
          from: "conversations",
          localField: "conversationId",
          foreignField: "_id",
          as: "conv",
        },
      },
      {
        $unwind: "$conv",
      },
      {
        $match: {
          "conv.participants": {
            $in: [new Types.ObjectId(socket.data.userId)],
          },
        },
      },
      {
        $addFields: {
          isLastMessage: {
            $cond: {
              if: { $eq: ["$_id", "$conv.lastMessage"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          conversationId: 1,
          sender: 1,
          isLastMessage: 1,
        },
      },
    ]);

    if (!msgList || msgList.length === 0) return;

    const ids = msgList.map((m) => m._id);
    const chunkSize = 500;
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      await Message.updateMany(
        { _id: { $in: chunk } },
        { $set: { status: "delivered" } },
      );
    }

    const grouped = msgList.reduce(
      (acc: { [key: string]: typeof msgList }, msg) => {
        const key = msg.conversationId.toString();
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(msg);
        return acc;
      },
      {},
    );

    for (const convId in grouped) {
      const msgIds = grouped[convId].map((m) => m._id.toString());

      // After Login Msg Bubble State Update
      io.to(`conversation:${convId}`).emit("bulkMsgBubbleStateDelivered", {
        conversationId: convId,
        msgIds,
        status: "delivered",
      });
    }

    const convUpdateList = msgList.filter((m) => m.isLastMessage);
    convUpdateList.forEach((m) => {
      // After Login Conversation List Last Message State Update
      io.to(`user:${m.sender.toString()}`).emit(
        "bulkConvListMsgStateDelivered",
        {
          ...m,
          status: "delivered",
        },
      );
    });
  } catch (error) {
    console.error("Error in msgDeliveredUpdate", error);
    socket.emit("errorMsg", "Error in msgDeliveredUpdate");
  }
};
