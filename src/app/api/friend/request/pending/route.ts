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
        { status: 401 }
      );
    }

    await ConnectDB();

    const pendingFriendRequests = await Friend.find({
      receiver: session.user?._id,
      status: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Friend request fetched.",
        data: pendingFriendRequests,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error while getting friend requests: ", err);
    return NextResponse.json(
      { success: false, message: "Error while getting friend requests." },
      { status: 500 }
    );
  }
}
