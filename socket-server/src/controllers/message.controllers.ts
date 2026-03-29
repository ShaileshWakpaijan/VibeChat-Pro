import { Socket, Server } from "socket.io";
import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";
import { Types } from "mongoose";
import "../models/User.js";
import { ConversationListResponse } from "../lib/types.js";
import { User } from "../models/User.js";

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

        const senderUser = await User.findById(sender).select(
          "moodVisibility username",
        );

        let receiver = conversation.participants.find(
          (p: Types.ObjectId) => p.toString() !== sender,
        );

        const receiverUser = await User.findById(receiver).select(
          "whoseMoodICanSee username",
        );

        let emotionLabel = null;

        if (
          (senderUser?.moodVisibility.mode === "everyone" ||
            (senderUser?.moodVisibility.mode === "custom" &&
              senderUser?.moodVisibility.customFriends.some((id) =>
                id.equals(receiver),
              ))) &&
          (receiverUser?.whoseMoodICanSee.mode === "everyone" ||
            (receiverUser?.whoseMoodICanSee.mode === "custom" &&
              receiverUser?.whoseMoodICanSee.customFriends.some((id) =>
                id.equals(senderUser._id),
              )))
        ) {
          emotionLabel = await emotionAPI(content);
        }

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

          if (p._id.toString() !== sender) {
            io.to(`user:${p._id.toString()}`).emit(
              "newEmotionLabel",
              emotionLabel,
            );
          }
          if (p._id.toString() === sender) {
            io.to(`user:${p._id.toString()}`).emit(
              "myNewEmotionLabel",
              emotionLabel,
            );
          }
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

  //After Reading New Message If Online
  socket.on("recvMsgRead", async (messageId: string) => {
    if (!messageId) return;

    let message = await Message.findById(messageId);
    if (!message) return;

    if (message.status === "read") return;
    if (message.sender.toString() === socket.data.userId) return;

    message.status = "read";
    await message.save().catch((e) => console.error("deliver save err", e));

    //After Message Sent If Receiver's Chat Opened: Conversation List Last Message State Update
    io.to(`user:${message.sender.toString()}`).emit(
      "singleConvListLastMsgStateRead",
      {
        _id: message._id.toString(),
        conversationId: message.conversationId.toString(),
        sender: message.sender.toString(),
        status: "read",
      },
    );

    //After Message Sent If Receiver's Chat Opened: Message Bubble State Update
    io.to(`conversation:${message.conversationId.toString()}`).emit(
      "singleMsgBubbleStateRead",
      {
        _id: message._id.toString(),
        conversationId: message.conversationId.toString(),
        sender: message.sender.toString(),
        status: "read",
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

export const msgReadUpdate = async (
  io: Server,
  socket: Socket,
  conversationId: string,
) => {
  try {
    const msgList: {
      _id: string;
      conversationId: string;
      sender: string;
      isLastMessage: boolean;
    }[] = await Message.aggregate([
      {
        $match: {
          status: { $in: ["sent", "delivered"] },
          conversationId: new Types.ObjectId(conversationId),
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
        { $set: { status: "read" } },
      );
    }

    socket.on("unreadMessageRead", async ({ messageIds, conversationId }) => {
      const chunkSize = 500;
      for (let i = 0; i < messageIds.length; i += chunkSize) {
        const chunk = messageIds.slice(i, i + chunkSize);
        await Message.updateMany(
          { _id: { $in: chunk } },
          { $set: { status: "read" } },
        );
      }

      io.to(`conversation:${conversationId}`).emit("bulkMsgBubbleStateRead", {
        conversationId,
        msgIds: messageIds,
        status: "read",
      });
    });

    // After Conv Open Msg Bubble State Update
    io.to(`conversation:${conversationId}`).emit("bulkMsgBubbleStateRead", {
      conversationId,
      msgIds: ids,
      status: "read",
    });

    // After Conv Open Conv List Last Msg State Update
    const [lastMsg] = msgList.filter((m) => m.isLastMessage);
    if (lastMsg) {
      io.to(`user:${lastMsg.sender.toString()}`).emit(
        "singleConvListLastMsgStateRead",
        {
          _id: lastMsg._id.toString(),
          conversationId: lastMsg.conversationId.toString(),
          sender: lastMsg.sender.toString(),
          status: "read",
        },
      );
    }
  } catch (error) {
    console.error("Error in msgReadUpdate", error);
    socket.emit("errorMsg", "Error in msgReadUpdate");
  }
};

async function emotionAPI(content: string) {
  const res = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: content }),
  });
  const body = await res.json();
  const scores = body.predictions[0].scores;

  const sorted = [...scores].sort((a, b) => b.score - a.score);

  const top1 = sorted[0];
  const top2 = sorted[1];

  const diff = (top1.score - top2.score) / top1.score;

  // If close enough → keep both
  if (diff < 0.05) {
    return { data: [top1.label, top2.label] };
  }

  // Otherwise → only top1
  return { data: [top1.label] };
}
