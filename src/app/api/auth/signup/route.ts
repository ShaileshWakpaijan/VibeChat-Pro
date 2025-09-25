import { sendOtpEmailByBrevo } from "@/lib/brevo";
import { ConnectDB } from "@/lib/ConnectDB";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, message: "All fields required." },
        { status: 400 }
      );
    }

    await ConnectDB();

    const existingUserWithUsername = await User.findOne({
      username,
    });

    if (existingUserWithUsername && existingUserWithUsername?.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken.",
        },
        { status: 409 }
      );
    } else {
      await User.findOneAndDelete({
        username,
      });
    }

    const existinUserWithEmail = await User.findOne({ email });

    if (existinUserWithEmail) {
      if (existinUserWithEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User with email already exists.",
          },
          { status: 409 }
        );
      } else {
        existinUserWithEmail.password = password;
        await existinUserWithEmail.save();

        const otp = generateOtp();
        const existingOtp = await Otp.findOne({ username });

        if (!existingOtp) {
          await Otp.create({
            username,
            otp,
            expiresAt: Date.now() + 1000 * 60 * 60,
          });
        } else {
          existingOtp.otp = otp;
          existingOtp.expiresAt = Date.now() + 1000 * 60 * 60;
          await existingOtp.save();
        }

        const emailResponse = await sendOtpEmailByBrevo(email, otp, username);

        if (!emailResponse.success) {
          return NextResponse.json(
            { success: false, message: "Error sending verification email" },
            { status: 500 }
          );
        }
      }
    } else {
      const newUser = new User({ email, username, password });
      await newUser.save();

      const otp = generateOtp();
      await Otp.create({
        username,
        otp,
        expiresAt: Date.now() + 1000 * 60 * 60,
      });

      const emailResponse = await sendOtpEmailByBrevo(email, otp, username);

      if (!emailResponse.success) {
        return NextResponse.json(
          { success: false, message: "Error sending verification email" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error: ", err);
    return NextResponse.json(
      { success: false, message: "Failed to signup user." },
      { status: 500 }
    );
  }
}
