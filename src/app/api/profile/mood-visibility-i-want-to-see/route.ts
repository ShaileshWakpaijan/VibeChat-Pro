import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import User from "@/models/User";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateVisibilitySchema = z.object({
  mode: z.enum(["everyone", "nobody", "custom"]),
  customFriends: z.array(z.string().min(1)).optional(),
});

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

    const dbUser = await User.findById(user._id)
      .select("whoseMoodICanSee")
      .populate({
        path: "whoseMoodICanSee.customFriends", // the field with ObjectIds
        select: "username", // only populate the username field
      });

    return NextResponse.json(
      {
        success: true,
        message: "Mood visibility you want to see fetched.",
        data: dbUser.whoseMoodICanSee,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Get mood visibility error: ", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get mood visibility you want to see.",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user || !user?._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsed = updateVisibilitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload",
        },
        { status: 400 },
      );
    }

    const { mode, customFriends } = parsed.data;

    await ConnectDB();

    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    if (mode !== "custom") {
      dbUser.whoseMoodICanSee = {
        mode,
        customFriends: [],
      };

      await dbUser.save();

      return NextResponse.json(
        {
          success: true,
          message: "Mood visibility you want to see updated.",
        },
        { status: 200 },
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          "whoseMoodICanSee.mode": "custom",
          "whoseMoodICanSee.customFriends": customFriends,
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Failed to update user." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Mood visibility you want to see updated",
        data: { whoseMoodICanSee: updatedUser.whoseMoodICanSee },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Update mood visibility error: ", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update mood visibility you want to see.",
      },
      { status: 500 },
    );
  }
}
