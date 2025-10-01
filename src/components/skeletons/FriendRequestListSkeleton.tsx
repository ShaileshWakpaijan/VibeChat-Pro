import { Button } from "../ui/button";
import { CommandItem } from "../ui/command";
import { Skeleton } from "../ui/skeleton";

export default function FriendRequestListSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <CommandItem key={i} className=" flex items-center justify-between">
          <div className=" flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full"></Skeleton>
            <Skeleton className="w-32 h-3"></Skeleton>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton>
              <Button className="w-24 bg-stone-200 dark:bg-stone-700" />
            </Skeleton>
            <Skeleton>
              <Button className="w-24 bg-stone-200 dark:bg-stone-700" />
            </Skeleton>
          </div>
        </CommandItem>
      ))}
    </>
  );
}
