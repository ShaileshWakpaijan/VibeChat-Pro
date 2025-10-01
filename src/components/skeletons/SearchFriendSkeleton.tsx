import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

function SearchFriendSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          className=" flex items-center justify-between px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 duration-100 rounded-lg mx-2"
          key={i}
        >
          <div className=" flex items-center gap-4">
            <Skeleton className=" w-8 h-8 rounded-full" />
            <Skeleton className="w-32 h-3" />
          </div>
          <Skeleton>
            <Button className="w-24 bg-stone-200 dark:bg-stone-700" />
          </Skeleton>
        </div>
      ))}
    </>
  );
}

export default SearchFriendSkeleton;
