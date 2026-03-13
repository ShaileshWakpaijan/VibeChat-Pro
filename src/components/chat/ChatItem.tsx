import { getPresence, onOnlinePresence } from "@/lib/socket";
import { LastMessage, Participant } from "@/lib/types/serverResponse";
import { Check, CheckCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ChatItem({
  lastMessage,
  name,
  unreadMsgNo,
  participants,
}: {
  lastMessage?: LastMessage;
  name: string;
  unreadMsgNo: number;
  participants: Participant[];
}) {
  const session = useSession();
  const myUserId = session?.data?.user?._id?.toString();
  const isSender = myUserId === lastMessage?.sender._id.toString();
  const [isOnline, setisOnline] = useState(false);

  const otherUser = participants.find(
    (p) => p._id.toString() !== myUserId,
  )?._id;

  useEffect(() => {
    if (!otherUser) return;
    setisOnline(getPresence(otherUser).online);
    const unsubscribe = onOnlinePresence(({ userId, online }) => {
      if (userId === otherUser) setisOnline(online);
    });

    return () => unsubscribe();
  }, [otherUser]);

  return (
    <div className="w-full px-6 py-4 hover:bg-white/7 transition-all duration-200 cursor-pointer flex items-center gap-3 border-b border-white/10">
      {/* Profile Picture */}
      <div className="relative">
        <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-stone-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {name?.charAt(0).toUpperCase()}
        </div>

        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-stone-800 rounded-full"></span>
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Row: Name & Time */}
        <div className="flex justify-between items-center text-sm font-medium dark:text-white">
          <span className="truncate">{name}</span>
          <span
            className={`text-xs ${unreadMsgNo > 0 ? "text-xs text-green-600 dark:text-green-400" : "text-stone-400 dark:text-white/60"} whitespace-nowrap`}
          >
            {new Date(lastMessage?.createdAt || "").toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Bottom Row: Message Preview */}
        <div className="flex justify-between items-center text-stone-600 dark:text-white/80 text-sm truncate">
          <div className="flex items-end justify-center gap-1">
            {isSender && lastMessage?.status === "sent" && <Check size={15} />}
            {isSender && lastMessage?.status === "delivered" && (
              <CheckCheck size={15} />
            )}
            {isSender && lastMessage?.status === "read" && (
              <CheckCheck size={15} className="text-green-500" />
            )}

            {lastMessage?.content}
          </div>
          {unreadMsgNo > 0 && (
            <div className=" bg-green-600 dark:bg-green-400 h-5 min-w-5 px-1 text-white dark:text-black rounded-full text-center font-semibold">
              {unreadMsgNo}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
