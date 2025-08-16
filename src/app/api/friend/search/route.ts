import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import User from "@/models/User";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!user || !user?._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 }
      );
    }

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username required", data: [] },
        { status: 400 }
      );
    }

    await ConnectDB();

    const userList = await User.aggregate([
      {
        $match: {
          username: { $regex: username, $options: "i" },
          _id: { $ne: new Types.ObjectId(user._id) },
        },
      },
      {
        $lookup: {
          from: "friends",
          let: { targetUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        {
                          $eq: ["$sender", new Types.ObjectId(user._id)],
                        },
                        { $eq: ["$receiver", "$$targetUserId"] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ["$sender", "$$targetUserId"] },
                        {
                          $eq: ["$receiver", new Types.ObjectId(user._id)],
                        },
                      ],
                    },
                  ],
                },
              },
            },
            { $project: { status: 1, _id: 0 } },
          ],
          as: "friendData",
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          status: { $arrayElemAt: ["$friendData.status", 0] },
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "User with given username",
        data: userList,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error while getting friend list: ", err);
    return NextResponse.json(
      { success: false, message: "Error while getting friend list." },
      { status: 500 }
    );
  }
}
