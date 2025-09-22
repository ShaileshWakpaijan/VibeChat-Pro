import { LastMessage } from "@/lib/types/serverResponse";

export default function ChatItem({
  lastMessage,
}: {
  lastMessage?: LastMessage;
}) {
  return (
    <div className="w-full px-6 py-4 hover:bg-white/7 transition-all duration-200 cursor-pointer flex items-center gap-3 border-b border-white/10">
      {/* Profile Picture */}
      <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-stone-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
        {lastMessage?.sender.username.charAt(0).toUpperCase()}
      </div>

      {/* Chat Info */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Row: Name & Time */}
        <div className="flex justify-between items-center text-sm font-medium dark:text-white">
          <span className="truncate">{lastMessage?.sender.username}</span>
          <span className="text-xs text-stone-400 dark:text-white/60 whitespace-nowrap">
            {new Date(lastMessage?.createdAt || "").toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Bottom Row: Message Preview */}
        <div className="flex items-center gap-1 text-stone-600 dark:text-white/80 text-sm truncate">
          <span className="rotate-y-180 rotate-45">L</span>
          <span>{lastMessage?.content}</span>
        </div>
      </div>
    </div>
  );
}
