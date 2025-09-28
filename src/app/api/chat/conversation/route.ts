import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import Conversation from "@/models/Conversation";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user?._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 }
      );
    }

    await ConnectDB();

    const conversations = await Conversation.aggregate([
      {
        $match: {
          participants: {
            $in: [new Types.ObjectId(user._id)],
          },
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
                      _id: 1,
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
                createdAt: 1,
                status: 1,
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
              else: {
                $let: {
                  vars: {
                    otherThanMe: {
                      $filter: {
                        input: "$participants",
                        as: "p",
                        cond: {
                          $ne: ["$$p._id", new Types.ObjectId(user._id)],
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
    ]);

    return NextResponse.json({ success: true, conversations }, { status: 200 });
  } catch (err) {
    console.error("Error while getting users conversations: ", err);
    return NextResponse.json(
      { success: false, message: "Error while getting users conversations." },
      { status: 500 }
    );
  }
}
