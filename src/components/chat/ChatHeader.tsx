import { getPresence, onOnlinePresence } from "@/lib/socket";
import { Participant } from "@/lib/types/serverResponse";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ChatHeader = ({
  name,
  participants,
}: {
  name: string;
  participants: Participant[];
}) => {
  const session = useSession();
  const myUserId = session?.data?.user?._id?.toString();
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
    <div className="flex items-center justify-between px-4 py-2 h-14">
      <div className="flex items-center gap-3">
        <Link href={"/chat"}>
          <ArrowLeft />
        </Link>
        <div className="relative">
          <div className="min-w-11 min-h-11 h-11 w-11 bg-stone-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {name?.charAt(0).toUpperCase()}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-stone-800 rounded-full"></span>
          )}
        </div>

        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white transition-all duration-300">
            {name}
          </span>

          <span
            className={`text-xs text-green-600 dark:text-green-400 transition-all duration-300 overflow-hidden ${
              isOnline
                ? "opacity-100 translate-y-0 max-h-4"
                : "opacity-0 -translate-y-1 max-h-0"
            }`}
          >
            Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="cursor-pointer dark:hover:bg-stone-800 hover:bg-stone-100 dark:md:bg-stone-900 p-1 md:p-2 md:rounded-lg md:border">
          <Phone className="w-5 h-5" />
        </button>
        <button className="cursor-pointer dark:hover:bg-stone-800 hover:bg-stone-100 dark:md:bg-stone-900 p-1 md:p-2 md:rounded-lg md:border">
          <Video className="w-5 h-5" />
        </button>
        <button className="cursor-pointer dark:hover:bg-stone-800 hover:bg-stone-100 dark:md:bg-stone-900 p-1 md:p-2 md:rounded-lg md:border">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
