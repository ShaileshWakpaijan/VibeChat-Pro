import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import { getAcceptedFriendIds } from "@/lib/services/getAcceptedFriendIds";
import User from "@/models/User";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { updateUserId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 },
      );
    }

    const { updateUserId } = await params;

    if (updateUserId === user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized to update this user's mood visibility.",
        },
        { status: 403 },
      );
    }

    await ConnectDB();

    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }
    console.log("updateUserId: ", updateUserId);
    const targetId = updateUserId.toString();

    const friendIds = await getAcceptedFriendIds(user._id.toString());

    if (!friendIds.includes(targetId)) {
      return NextResponse.json(
        {
          success: false,
          message: "This user is not in your friend list.",
        },
        { status: 400 },
      );
    }

    const currentMode = dbUser.whoseMoodICanSee?.mode ?? "everyone";
    const currentCustomFriends = (
      dbUser.whoseMoodICanSee?.customFriends ?? []
    ).map((id: Types.ObjectId | string) => id.toString());

    let nextMode: "everyone" | "nobody" | "custom" = currentMode;
    let nextCustomFriends: string[] = [];

    if (currentMode === "custom") {
      const exists = currentCustomFriends.includes(targetId);

      nextCustomFriends = exists
        ? currentCustomFriends.filter((id: string) => id !== targetId)
        : [...currentCustomFriends, targetId];

      if (nextCustomFriends.length === 0) {
        nextMode = "everyone";
      } else {
        nextMode = "custom";
      }
    }

    if (currentMode === "nobody") {
      nextMode = "custom";
      nextCustomFriends = [targetId];
    }

    if (currentMode === "everyone") {
      nextMode = "custom";
      nextCustomFriends = friendIds.filter((id) => id !== targetId);
    }

    dbUser.whoseMoodICanSee = {
      mode: nextMode,
      customFriends: nextCustomFriends.map((id) => new Types.ObjectId(id)),
    };

    await dbUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Mood visibility updated successfully.",
        data: dbUser.whoseMoodICanSee,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Update mood visibility for single user error: ", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update mood visibility you want to see.",
      },
      { status: 500 },
    );
  }
}
