import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import Friend from "@/models/Friend";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { friendId } = await req.json();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!friendId) {
      return NextResponse.json(
        { success: false, message: "Friend ID is required" },
        { status: 400 }
      );
    }

    if (!user || !user?._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 }
      );
    }

    if (friendId === user?._id) {
      return NextResponse.json(
        {
          success: false,
          message: "Your ID and friend ID should not be same.",
        },
        { status: 400 }
      );
    }

    await ConnectDB();

    const isFriend = await Friend.findOne({
      $or: [
        { sender: session.user?._id, receiver: friendId },
        { receiver: session.user?._id, sender: friendId },
      ],
    });

    if (!isFriend) {
      return NextResponse.json(
        { success: false, message: "Friend not found." },
        { status: 404 }
      );
    }

    if (isFriend.status === "pending") {
      return NextResponse.json(
        { success: false, message: "You are not friends yet." },
        { status: 400 }
      );
    }

    const removedFriend = await Friend.deleteOne({
      $or: [
        { sender: session.user?._id, receiver: friendId, status: "accepted" },
        { receiver: session.user?._id, sender: friendId, status: "accepted" },
      ],
    });

    return NextResponse.json(
      { success: true, message: "Friend removed from friend list." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error while removing friend: ", err);
    return NextResponse.json(
      { success: false, message: "Error while removing friend" },
      { status: 500 }
    );
  }
}
