import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import Friend from "@/models/Friend";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { receiver } = await req.json();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!receiver) {
      return NextResponse.json(
        { success: false, message: "Receiver ID is required" },
        { status: 400 }
      );
    }

    if (!user || !user?._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 }
      );
    }
    if (receiver === user?._id) {
      return NextResponse.json(
        { success: false, message: "You can't be receiver to cancel." },
        { status: 400 }
      );
    }

    await ConnectDB();

    const isFriendRequest = await Friend.findOne({
      sender: session.user?._id,
      receiver,
    });

    if (!isFriendRequest) {
      return NextResponse.json(
        { success: false, message: "Friend request not found." },
        { status: 404 }
      );
    }

    if (isFriendRequest.status === "accepted") {
      return NextResponse.json(
        { success: false, message: "You are already firends, can't cancel." },
        { status: 400 }
      );
    }

    await Friend.deleteOne({
      receiver,
      sender: session.user?._id,
    });

    return NextResponse.json(
      { success: true, message: "Friend request cancelled." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error while cancelling friend request: ", err);
    return NextResponse.json(
      { success: false, message: "Error while cancelling friend request" },
      { status: 500 }
    );
  }
}
