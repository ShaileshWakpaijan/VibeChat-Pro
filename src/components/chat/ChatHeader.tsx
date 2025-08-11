import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import React from "react";

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 h-14">
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <ArrowLeft />
        </div>
        <div className="relative">
          <div className="min-w-[44px] min-h-[44px] h-11 w-11 bg-stone-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            SW
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-stone-800 rounded-full"></span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
            Shailesh
          </span>
          <span className="text-xs text-green-600 dark:text-green-400">
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
