import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import Friend from "@/models/Friend";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { sender } = await req.json();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!sender) {
      return NextResponse.json(
        { success: false, message: "Sender ID is required" },
        { status: 400 }
      );
    }

    if (!user || !user?._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 }
      );
    }
    if (sender === user?._id) {
      return NextResponse.json(
        { success: false, message: "You can't be sender to accept." },
        { status: 400 }
      );
    }

    await ConnectDB();

    const isFriend = await Friend.findOne({
      sender,
      receiver: session.user?._id,
    });

    if (!isFriend) {
      return NextResponse.json(
        { success: false, message: "Friend request not found." },
        { status: 404 }
      );
    }

    if (isFriend.status === "accepted") {
      return NextResponse.json(
        { success: false, message: "You are already firends." },
        { status: 400 }
      );
    }

    isFriend.status = "accepted";
    await isFriend.save();

    return NextResponse.json(
      { success: true, message: "Friend request accepted." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error while rejecting friend request: ", err);
    return NextResponse.json(
      { success: false, message: "Error while accepting friend request" },
      { status: 500 }
    );
  }
}
