import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
export const socketAuth = async (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token provided"));
    }
    console.log("Token: ", token);
    const secret = process.env.SOCKET_JWT_SECRET as string;

    const decoded = jwt.verify(token, secret) as { sub: string };

    console.log(decoded);

    socket.data.userId = decoded.sub;

    next();
  } catch (error) {
    console.log("not decoding", error);
    next(new Error("Authentication Failed"));
  }
};
