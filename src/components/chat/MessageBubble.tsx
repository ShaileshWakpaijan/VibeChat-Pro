import { Check, CheckCheck } from "lucide-react";
import React from "react";

type MessageProps = {
  text: string;
  isSender: boolean;
  time: string;
  status: "sent" | "delivered" | "read";
};

const MessageBubble = ({ text, isSender, time, status }: MessageProps) => {
  return (
    <div
      className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2 px-4`}
    >
      <div
        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm break-words dark:text-white
          ${isSender ? "dark:bg-stone-700 bg-stone-200 rounded-br-none" : "dark:bg-stone-900 bg-stone-100 rounded-bl-none"}
        `}
      >
        <div className="flex items-end justify-between gap-2">
          <p className="flex-1">{text}</p>
          <span className="text-[10px] text-gray-400 flex">
            {new Date(time || "").toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {isSender && (
              <span className=" ml-1">
                {status === "sent" && <Check size={15} />}
                {status === "delivered" && <CheckCheck size={15} />}
                {status === "read" && (
                  <CheckCheck size={15} className="text-green-500" />
                )}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
