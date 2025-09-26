import { ConnectDB } from "@/lib/ConnectDB";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, otp } = await req.json();
    await ConnectDB();
    const user = await User.findOne({ username });
    if (user?.isVerified) {
      return NextResponse.json(
        { success: false, message: "User already verified." },
        { status: 400 }
      );
    }
    const existingOtp = await Otp.findOne({ username });
    if (!existingOtp || existingOtp.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP." },
        { status: 400 }
      );
    }

    if (Date.now() > existingOtp.expiresAt) {
      return NextResponse.json(
        { success: false, message: "OTP expired." },
        { status: 400 }
      );
    }

    await User.findOneAndUpdate({ username }, { isVerified: true });
    await Otp.findOneAndDelete({ username });
    return NextResponse.json(
      { success: true, message: "Email verified successfylly." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error: ", err);
    return NextResponse.json(
      { success: false, message: "Failed to verify otp." },
      { status: 500 }
    );
  }
}
