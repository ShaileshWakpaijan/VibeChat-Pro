import { getPresence, onOnlinePresence } from "@/lib/socket";
import { Participant } from "@/lib/types/serverResponse";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import useMoodVisibility from "@/hooks/useMoodVisibility";
import useMoodVisibilityIwantTosSee from "@/hooks/useMoodVisibilityIwantTosSee";
import { toast } from "sonner";
import { toastStyles } from "@/lib/ToastStyle";

const ChatHeader = ({
  name,
  participants,
  myEmotionLabel,
  senderEmotionLabel,
  showMyMoodProps,
  seeHisMoodProps,
}: {
  name: string;
  participants: Participant[];
  myEmotionLabel: string[];
  senderEmotionLabel: string[];
  showMyMoodProps: boolean;
  seeHisMoodProps: boolean;
}) => {
  const session = useSession();
  const myUserId = session?.data?.user?._id?.toString();
  const [isOnline, setisOnline] = useState(false);
  const [showMyMood, setShowMyMood] = useState<boolean>(showMyMoodProps);
  const [seeHisMood, setSeeHisMood] = useState<boolean>(seeHisMoodProps);
  const { updateShowMyMood } = useMoodVisibility();
  const { updateSeeHisMood } = useMoodVisibilityIwantTosSee();
  const emotionEmojis: Record<string, string> = {
    angry: "😠",
    happy: "😂",
    love: "❤️",
    neutral: "😐",
    sad: "😢",
    surprised: "😲",
  };

  const otherUser = participants.find(
    (p) => p._id.toString() !== myUserId,
  )?._id;

  const showMyMoodUpdateHandler = async () => {
    if (!otherUser) return;
    const res = await updateShowMyMood(otherUser);

    if (!res.success) {
      toast.error(<span>{res?.message}</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
      return;
    }
    setShowMyMood((prev) => !prev);
  };

  const seeHisMoodUpdateHandler = async () => {
    if (!otherUser) return;
    const res = await updateSeeHisMood(otherUser);

    if (!res.success) {
      toast.error(<span>{res?.message}</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
      return;
    }
    setSeeHisMood((prev) => !prev);
  };

  const callHandler = () => {
    toast.error(
      <span>This feature will be included in a later version.</span>,
      {
        style: toastStyles.warning as React.CSSProperties,
      },
    );
  };

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
          <div
            className={`min-w-11 min-h-11 h-11 w-11 rounded-full flex items-center justify-center text-white text-sm font-semibold ${senderEmotionLabel.length > 0 ? "bg-black" : "bg-stone-700"}`}
          >
            {senderEmotionLabel.length > 0 ? (
              <span className="scale-300">
                {emotionEmojis[senderEmotionLabel[0]]}
              </span>
            ) : (
              name?.charAt(0).toUpperCase()
            )}
          </div>
          {isOnline && (
            <>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-stone-800 rounded-full"></span>
            </>
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
        {myEmotionLabel.length > 0 && (
          <span className="text-sm font-semibold bg-stone-300 dark:bg-stone-700 py-1 px-2 rounded-md">
            You: {myEmotionLabel.map((e) => emotionEmojis[e])}
          </span>
        )}
        <button
          onClick={callHandler}
          className="cursor-pointer dark:hover:bg-stone-800 hover:bg-stone-100 dark:md:bg-stone-900 p-1 md:p-2 md:rounded-lg md:border"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          onClick={callHandler}
          className="cursor-pointer dark:hover:bg-stone-800 hover:bg-stone-100 dark:md:bg-stone-900 p-1 md:p-2 md:rounded-lg md:border"
        >
          <Video className="w-5 h-5" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="cursor-pointer dark:hover:bg-stone-800 hover:bg-stone-100 dark:md:bg-stone-900 p-1 md:p-2 md:rounded-lg md:border">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 p-2 border dark:bg-stone-900 flex flex-col gap-4 mt-2 mr-5 rounded-lg shadow-lg z-50">
            <div className="flex items-center space-x-2 w-full p-2">
              <Switch
                id="airplane-mode"
                checked={showMyMood}
                onCheckedChange={showMyMoodUpdateHandler}
              />
              <Label htmlFor="airplane-mode">Show my mood</Label>
            </div>
            <div className="flex items-center space-x-2 w-full p-2">
              <Switch
                id="airplane-mode2"
                checked={seeHisMood}
                onCheckedChange={seeHisMoodUpdateHandler}
              />
              <Label htmlFor="airplane-mode2">View his mood</Label>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
