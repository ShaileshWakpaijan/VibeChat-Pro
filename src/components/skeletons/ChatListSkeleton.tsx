import { Skeleton } from "../ui/skeleton";

export default function ChatListSkeleton() {
  return (
    <div className="w-full overflow-hidden">
      {Array.from({ length: 15 }).map((_, i) => (
        <ChatItemSkeleton key={i} />
      ))}
    </div>
  );
}

function ChatItemSkeleton() {
  return (
    <div className="w-full px-6 py-4 flex items-center gap-3 border-b border-white/10">
      <Skeleton className="min-w-[48px] min-h-[48px] w-12 h-12 rounded-full"></Skeleton>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <Skeleton className="w-28 h-3"></Skeleton>
          <Skeleton className="w-12 h-3"> </Skeleton>
        </div>
        <Skeleton className="w-40 h-3"></Skeleton>
      </div>
    </div>
  );
}
