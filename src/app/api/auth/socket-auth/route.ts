import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?._id) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const payload = { sub: session.user._id };
  const secret = process.env.SOCKET_JWT_SECRET as string;
  const expiresIn = Number(process.env.SOCKET_JWT_EXPIRES || 300);

  const token = jwt.sign(payload, secret, { expiresIn });

  return NextResponse.json(
    { token, success: true, message: "Socket token generated" },
    { status: 200 },
  );
}
