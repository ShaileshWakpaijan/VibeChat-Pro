import { authOptions } from "@/lib/authOptions";
import { ConnectDB } from "@/lib/ConnectDB";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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

    const { newUsername } = await req.json();

    if (!newUsername) {
      return NextResponse.json(
        { success: false, message: "New username is required." },
        { status: 400 },
      );
    }

    const usernameNorm = String(newUsername).trim().toLowerCase();

    if (!/^[a-z0-9_.]{1,15}$/.test(usernameNorm)) {
      return NextResponse.json(
        { success: false, message: "Invalid username format." },
        { status: 400 },
      );
    }

    if (usernameNorm === user?.username) {
      return NextResponse.json(
        { success: false, message: "This is already your current username." },
        { status: 409 },
      );
    }

    await ConnectDB();
    const existingUserWithUsername = await User.findOne({
      username: usernameNorm,
    });

    if (existingUserWithUsername && existingUserWithUsername.isVerified) {
      return NextResponse.json(
        { success: false, message: "Username already taken." },
        { status: 409 },
      );
    }

    if (existingUserWithUsername && !existingUserWithUsername.isVerified) {
      return NextResponse.json(
        { success: false, message: "Username is reserved. Try again later." },
        { status: 409 },
      );
    }

    await User.findByIdAndUpdate(user._id, {
      username: usernameNorm,
    });

    return NextResponse.json(
      { success: true, message: "Username updated successfully." },
      { status: 201 },
    );
  } catch (err) {
    console.error("Update username error: ", err);
    return NextResponse.json(
      { success: false, message: "Failed to update username." },
      { status: 500 },
    );
  }
}
