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
        { success: false, message: "Can't send friend request yourself." },
        { status: 400 }
      );
    }

    await ConnectDB();

    const isFriend = await Friend.findOne({
      $or: [
        { sender: session.user?._id, receiver },
        { receiver: session.user?._id, sender: receiver },
      ],
    });

    if (!isFriend) {
      await Friend.create({
        sender: session.user?._id,
        receiver,
      });

      return NextResponse.json(
        { success: true, message: "Friend request is sent." },
        { status: 201 }
      );
    }

    if (isFriend.status === "pending" && isFriend.sender.equals(user?._id)) {
      return NextResponse.json(
        { success: false, message: "Already requested." },
        { status: 400 }
      );
    }

    if (isFriend.status === "pending" && isFriend.receiver.equals(user?._id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Request is already in your pending requestes.",
        },
        { status: 400 }
      );
    }

    if (isFriend.status === "accepted") {
      return NextResponse.json(
        { success: false, message: "You are already firends" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Error while sending friend request: ", err);
    return NextResponse.json(
      { success: false, message: "Error while sending friend request" },
      { status: 500 }
    );
  }
}
