import { LastMessage } from "@/lib/types/serverResponse";
import { Check, CheckCheck } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ChatItem({
  lastMessage,
  name,
}: {
  lastMessage?: LastMessage;
  name: string;
}) {
  const session = useSession();
  const isSender = session?.data?.user?._id == lastMessage?.sender._id;
  return (
    <div className="w-full px-6 py-4 hover:bg-white/7 transition-all duration-200 cursor-pointer flex items-center gap-3 border-b border-white/10">
      {/* Profile Picture */}
      <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-stone-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
        {name?.charAt(0).toUpperCase()}
      </div>

      {/* Chat Info */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Row: Name & Time */}
        <div className="flex justify-between items-center text-sm font-medium dark:text-white">
          <span className="truncate">{name}</span>
          <span className="text-xs text-green-600 dark:text-green-400 whitespace-nowrap">
            {/* <span className="text-xs text-stone-400 dark:text-white/60 whitespace-nowrap"> */}
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
          <div className=" bg-green-600 dark:bg-green-400 h-5 w-5 text-white dark:text-black rounded-full text-center font-semibold">
            2
          </div>
        </div>
      </div>
    </div>
  );
}
