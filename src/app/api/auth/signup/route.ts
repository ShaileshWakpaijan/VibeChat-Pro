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

    const emailNorm = String(email).trim().toLowerCase();
    const usernameNorm = String(username).trim().toLowerCase();

    await ConnectDB();

    const existinUserWithEmail = await User.findOne({ email: emailNorm });
    const existingUserWithUsername = await User.findOne({
      username: usernameNorm,
    });

    if (existinUserWithEmail && existinUserWithEmail.isVerified) {
      return NextResponse.json(
        { success: false, message: "User with email already exists." },
        { status: 409 }
      );
    }

    if (existingUserWithUsername && existingUserWithUsername.isVerified) {
      return NextResponse.json(
        { success: false, message: "Username already taken." },
        { status: 409 }
      );
    }

    const usernameOtpDoc = await Otp.findOne({ username: usernameNorm });
    const isUsernameOtpValid =
      !!usernameOtpDoc &&
      usernameOtpDoc.expiresAt &&
      usernameOtpDoc.expiresAt.getTime() > Date.now();

    // If email exists but unverified
    if (existinUserWithEmail && !existinUserWithEmail.isVerified) {
      // If username also exists but with other user
      if (
        existingUserWithUsername &&
        existingUserWithUsername._id.toString() !==
          existinUserWithEmail._id.toString()
      ) {
        if (isUsernameOtpValid) {
          return NextResponse.json(
            {
              success: false,
              message: "Username is reserved. Try again later.",
            },
            { status: 409 }
          );
        } else {
          await Otp.deleteOne({ username: usernameNorm })
          await User.deleteOne({ _id: existingUserWithUsername._id })
        }
      }

      // Username if free
      existinUserWithEmail.username = usernameNorm;
      existinUserWithEmail.password = password;
      await existinUserWithEmail.save();

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

      const existingOtp = await Otp.findOne({ username: usernameNorm });
      if (!existingOtp) {
        await Otp.create({ username: usernameNorm, otp, expiresAt });
      } else {
        existingOtp.otp = otp;
        existingOtp.expiresAt = expiresAt;
        await existingOtp.save();
      }

      const emailResponse = await sendOtpEmailByBrevo(
        emailNorm,
        otp,
        usernameNorm
      );
      if (!emailResponse.success) {
        return NextResponse.json(
          { success: false, message: "Error sending verification email" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "OTP sent successfully. Please verify your account.",
        },
        { status: 201 }
      );
    }

    // If email doesn't exist (new email)
    if (!existinUserWithEmail) {
      // If username exists but unverified
      if (existingUserWithUsername && !existingUserWithUsername.isVerified) {
        if (isUsernameOtpValid) {
          return NextResponse.json(
            {
              success: false,
              message: "Username is reserved. Try again later.",
            },
            { status: 409 }
          );
        } else {
          await Otp.deleteOne({ username: usernameNorm }).catch(() => {});
          await User.deleteOne({ _id: existingUserWithUsername._id }).catch(
            () => {}
          );
        }
      }

      // Username if free
      const newUser = new User({
        email: emailNorm,
        username: usernameNorm,
        password,
      });
      await newUser.save();

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
      await Otp.create({ username: usernameNorm, otp, expiresAt });

      const emailResponse = await sendOtpEmailByBrevo(
        emailNorm,
        otp,
        usernameNorm
      );
      if (!emailResponse.success) {
        await Otp.deleteOne({ username: usernameNorm }).catch(() => {});
        await User.deleteOne({ _id: newUser._id }).catch(() => {});

        return NextResponse.json(
          { success: false, message: "Error sending verification email" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "OTP sent successfully. Please verify your account.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Unable to process request." },
      { status: 400 }
    );
  } catch (err) {
    console.error("Signup error: ", err);
    return NextResponse.json(
      { success: false, message: "Failed to signup user." },
      { status: 500 }
    );
  }
}
