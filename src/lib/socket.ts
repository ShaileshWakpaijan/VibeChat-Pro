import { AxiosResponse } from "axios";
import { io, Socket } from "socket.io-client";
import Axios from "./axios";
import { toast } from "sonner";
import { toastStyles } from "./ToastStyle";
import { latestMessage } from "@/components/chat/ChatList";
import { ConversationListResponse } from "./types/serverResponse";

let socket: Socket | null = null;

type PresencePayload = { userId: string; online: boolean };
const presenceCache = new Set<string>();
const onlinePresenceListeners = new Set<(p: PresencePayload) => void>();

export const onOnlinePresence: (
  cb: (p: PresencePayload) => void,
) => () => void = (cb) => {
  onlinePresenceListeners.add(cb);
  return () => {
    onlinePresenceListeners.delete(cb);
  };
};

export function getPresence(userId?: string) {
  if (!userId) return { userId, online: false };
  return { userId, online: presenceCache.has(userId) };
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

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

  socket.on("connect", () => {
    socket?.emit("join");
  });

  socket.on("errorMsg", (err: string) => {
    console.log("Server errorMsg:", err);
    const text = err || "Server error";
    toast.error(text, {
      style: toastStyles.danger as React.CSSProperties,
    });
  });

  socket?.on("newMsgNotification", (data: ConversationListResponse) => {
    latestMessage(data);
    socket?.emit("recvMsgDelivered", data.lastMessage._id);
  });

  socket.on("onlinePresence", (payload: PresencePayload) => {
    if (payload.online) presenceCache.add(payload.userId);
    else presenceCache.delete(payload.userId);
    for (const cb of onlinePresenceListeners) cb(payload);
  });

  socket.on("onlineUsers", (ids: string[]) => {
    for (const id of ids) {
      presenceCache.add(id);
      for (const cb of onlinePresenceListeners)
        cb({ userId: id, online: true });
    }
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
