import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
export const socketAuth = async (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.error("[socketAuth] no token provided");
      return next(new Error("No token provided"));
    }

    const secret = process.env.SOCKET_JWT_SECRET as string;
    if (!secret) {
      console.error("[socketAuth] MISSING SOCKET_JWT_SECRET env");
      return next(new Error("Auth config error"));
    }

    const decoded = jwt.verify(token, secret) as { sub: string };
    if (!decoded) {
      console.error("[socketAuth] failed to decode token");
      return next(new Error("Failed to decode token"));
    }

    socket.data.userId = decoded.sub;

    next();
  } catch (error) {
    console.error("[socketAuth] authentication failed:", error);
    next(new Error("Authentication Failed"));
  }
};
