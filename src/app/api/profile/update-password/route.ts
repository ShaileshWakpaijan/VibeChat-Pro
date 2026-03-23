import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { ConnectDB } from "@/lib/ConnectDB";

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

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Both old and new password are required." },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long.",
        },
        { status: 400 },
      );
    }

    ConnectDB();
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    const isMatch = await dbUser.isPasswordCorrect(oldPassword);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect old password." },
        { status: 400 },
      );
    }

    const isSamePassword = await dbUser.isPasswordCorrect(newPassword);
    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be different from old password.",
        },
        { status: 400 },
      );
    }

    dbUser.password = newPassword;
    await dbUser.save();
    return NextResponse.json(
      { success: true, message: "Password updated successfully." },
      { status: 201 },
    );
  } catch (err) {
    console.error("Update password error: ", err);
    return NextResponse.json(
      { success: false, message: "Failed to update password." },
      { status: 500 },
    );
  }
}
