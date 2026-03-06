import { AxiosResponse } from "axios";
import { io, Socket } from "socket.io-client";
import Axios from "./axios";
import { toast } from "sonner";
import { toastStyles } from "./ToastStyle";

let socket: Socket | null = null;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

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

  socket.on("errorMsg", (err: string) => {
    console.log("Server errorMsg:", err);
    const text = err || "Server error";
    toast.error(text, {
      style: toastStyles.danger as React.CSSProperties,
    });
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
