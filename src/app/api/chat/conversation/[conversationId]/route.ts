import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import Conversation from "@/models/Conversation";
import Friend from "@/models/Friend";
import Message from "@/models/Message";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user?._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 }
      );
    }

    const { conversationId } = await params;

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: "Conversation or Friend ID is required." },
        { status: 400 }
      );
    }

    await ConnectDB();

    const [conversation] = await Conversation.aggregate([
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
                _id: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          chatName: {
            $cond: {
              if: {
                $eq: ["$type", "group"],
              },
              then: "$groupName",
              else: {
                $let: {
                  vars: {
                    otherThanMe: {
                      $filter: {
                        input: "$participants",
                        as: "p",
                        cond: {
                          $ne: ["$$p._id", new Types.ObjectId(user?._id)],
                        },
                      },
                    },
                  },
                  in: {
                    $arrayElemAt: ["$$otherThanMe.username", 0],
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          chatName: 1,
          participants: 1,
        },
      },
    ]);

    if (!conversation) {
      const one2OneConversation = await Conversation.findOne({
        participants: { $all: [user._id, conversationId] },
        type: "one_to_one",
      });

      if (!one2OneConversation) {
        const friends = await Friend.findOne({
          $or: [
            { sender: user._id, receiver: conversationId, status: "accepted" },
            { sender: conversationId, receiver: user._id, status: "accepted" },
          ],
        });

        if (!friends) {
          return NextResponse.json(
            {
              success: false,
              message: "No such friend or conversation found.",
              isFriend: false,
            },
            { status: 403 }
          );
        }

        return NextResponse.json(
          { success: false, message: "Start a conversation.", isFriend: true },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Redirect to one-2-one conversation.",
          one2OneConversation,
        },
        { status: 200 }
      );
    }

    if (
      !conversation?.participants
        .map((p: Types.ObjectId) => p._id.toString())
        .includes(user._id.toString())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not part of this conversation.",
        },
        { status: 403 }
      );
    }

    let messages = [];
    messages = await Message.find({ conversationId: conversation?._id })
      .populate("sender", "username")
      .sort({ createdAt: 1 })
      .limit(20);

    return NextResponse.json(
      {
        success: true,
        message: "Message loaded successfully.",
        messages,
        conversation,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error while getting conversation: ", err);

    return NextResponse.json(
      { success: false, message: "Error while getting conversation." },
      { status: 500 }
    );
  }
}
