type Props = { name: string };

export default function ChatItem({ name }: Props) {
  return (
    <div className="w-full px-6 py-4 hover:bg-white/7 transition-all duration-200 cursor-pointer flex items-center gap-3 border-b border-white/10">
      {/* Profile Picture */}
      <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-stone-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
        SW
      </div>

      {/* Chat Info */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Row: Name & Time */}
        <div className="flex justify-between items-center text-sm font-medium text-white">
          <span className="truncate">Shailesh Wakpaijan</span>
          <span className="text-xs text-white/60 whitespace-nowrap">
            Yesterday
          </span>
        </div>

        {/* Bottom Row: Message Preview */}
        <div className="flex items-center gap-1 text-white/80 text-sm truncate">
          <span>✔</span>
          <span>This is the last message.</span>
        </div>
      </div>
    </div>
  );
}
