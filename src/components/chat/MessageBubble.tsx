import React from "react";

type MessageProps = {
  text: string;
  isSender: boolean;
  time: string;
};

const MessageBubble = ({ text, isSender, time }: MessageProps) => {
  return (
    <div
      className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2 px-4`}
    >
      <div
        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm break-words
          ${isSender ? "bg-stone-700 text-white rounded-br-none" : "bg-stone-900 text-white rounded-bl-none"}
        `}
      >
        <div className="flex items-end justify-between gap-2">
          <p className="flex-1">{text}</p>
          <span className="text-[10px] text-gray-400">
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
