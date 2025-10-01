import { Skeleton } from "../ui/skeleton";

export default function ChatWindowSkeleton() {
  return (
    <div className="flex flex-col-reverse py-2 overflow-hidden">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i}>
          <MessageBubbleSkeleton isSender={i % 2 ? false : true} long={false} />
          <MessageBubbleSkeleton isSender={i % 2 ? false : true} long={true} />
        </div>
      ))}
    </div>
  );
}

function MessageBubbleSkeleton({
  isSender,
  long,
}: {
  isSender: boolean;
  long: boolean;
}) {
  return (
    <div
      className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2 px-4`}
    >
      <Skeleton className={`max-w-[80%] px-3 py-2 rounded-lg`}>
        <div
          className={`flex items-end justify-between gap-2 ${long ? "w-44" : "w-24"} h-5`}
        />
      </Skeleton>
    </div>
  );
}
