import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import Friend from "@/models/Friend";
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

    const pendingFriendRequests = await Friend.find({
      $or: [
        {
          receiver: session.user?._id,
          status: "accepted",
        },
        {
          sender: session.user?._id,
          status: "accepted",
        },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Friend list fetched.",
        data: pendingFriendRequests,
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
