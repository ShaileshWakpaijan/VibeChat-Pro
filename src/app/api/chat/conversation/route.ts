import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import Conversation from "@/models/Conversation";
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

    const conversations = await Conversation.find({
      participants: user._id,
    })
      .populate("participants", "username")
      .populate({
        path: "lastMessage",
        select: "content createdAt",
        populate: { path: "sender", select: "username" },
      });

    return NextResponse.json({ success: true, conversations }, { status: 200 });
  } catch (err) {
    console.error("Error while getting users conversations: ", err);
    return NextResponse.json(
      { success: false, message: "Error while getting users conversations." },
      { status: 500 }
    );
  }
}
