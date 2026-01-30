import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user?._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 },
      );
    }

    const { conversationId } = await params;
    const { content } = await req.json();

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: "Conversation or Friend ID is required." },
        { status: 400 },
      );
    }

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Empty message is not allowed" },
        { status: 400 },
      );
    }

    await ConnectDB();

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: "No such conversation found.",
          isFriend: false,
        },
        { status: 403 },
      );
    }

    if (
      !conversation.participants
        .map((p: Types.ObjectId) => p.toString())
        .includes(user._id.toString())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not part of this conversation.",
        },
        { status: 403 },
      );
    }

    const message = await Message.create({
      conversationId,
      sender: user._id,
      content: content.trim(),
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    return NextResponse.json(
      { success: true, message: "Message sent successfully." },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error while sending message: ", err);

    return NextResponse.json(
      { success: false, message: "Error while sending message." },
      { status: 500 },
    );
  }
}
