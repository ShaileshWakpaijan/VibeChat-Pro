import { ArrowLeft } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

export default function ChatHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-2 h-">
      <div className="flex items-center gap-3">
        <Link href={"/chat"} className="lg:hidden">
          <ArrowLeft />
        </Link>
        <div className="relative">
          <Skeleton className="min-w-[44px] min-h-[44px] h-11 w-11 rounded-full"></Skeleton>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="w-36 h-3" />
          <Skeleton className="w-20 h-3"></Skeleton>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="p-1 md:p-2 md:rounded-lg">
          <div className="w-5 h-5" />
        </Skeleton>
        <Skeleton className="p-1 md:p-2 md:rounded-lg">
          <div className="w-5 h-5" />
        </Skeleton>
        <Skeleton className="p-1 md:p-2 md:rounded-lg">
          <div className="w-5 h-5" />
        </Skeleton>
      </div>
    </div>
  );
}
