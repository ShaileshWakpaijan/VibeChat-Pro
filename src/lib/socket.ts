import { AxiosResponse } from "axios";
import { io, Socket } from "socket.io-client";
import Axios from "./axios";

let socket: Socket | null = null;

const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:3001";

export const connectSocket = async () => {
  if (socket) {
    return socket;
  }

  const res: AxiosResponse = await Axios.get("/auth/socket-auth");
  if (!res.data.success) throw new Error("Cannot get socket token");
  const { token } = res.data;

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: { token },
  });

  socket.on("connection", () => {
    console.log("Connected to socket: ", socket?.id);
    socket?.emit("join");
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
};
