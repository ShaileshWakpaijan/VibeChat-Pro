import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import Friend from "@/models/Friend";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user?._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 },
      );
    }

    await ConnectDB();

    const friendsList = await Friend.find({
      $or: [
        { receiver: session.user?._id, status: "accepted" },
        { sender: session.user?._id, status: "accepted" },
      ],
    })
      .populate("sender", "username")
      .populate("receiver", "username");

    const formattedFriends = friendsList.map((friend) => {
      const isSender =
        friend.sender._id.toString() === session.user._id.toString();

      return isSender
        ? {
            _id: friend.receiver._id,
            username: friend.receiver.username,
          }
        : {
            _id: friend.sender._id,
            username: friend.sender.username,
          };
    });

    console.log(formattedFriends);

    return NextResponse.json(
      {
        success: true,
        message: "Friend list fetched.",
        data: formattedFriends,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error while getting friend list: ", err);
    return NextResponse.json(
      { success: false, message: "Error while getting friend list." },
      { status: 500 },
    );
  }
}

