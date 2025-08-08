"use client";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "./ChatInput";

type Props = {
  chatId: string;
};

export default function ChatWindow({ chatId }: Props) {
  return (
    <div className="md:px-4 h-full flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b h-14">
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
          <button className="cursor-pointer hover:bg-stone-800 md:bg-stone-900 p-1 md:p-2 md:rounded-lg md:border">
            <Phone className="w-5 h-5 md:w-5 md:h-5" />
          </button>
          <button className="cursor-pointer hover:bg-stone-800 md:bg-stone-900 p-1 md:p-2 md:rounded-lg md:border">
            <Video className="w-5 h-5 md:w-5 md:h-5" />
          </button>
          <button className="cursor-pointer hover:bg-stone-800 md:bg-stone-900 p-1 md:p-2 md:rounded-lg md:border">
            <MoreVertical className="w-5 h-5 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Message Area */}
      <ScrollArea className=" h-[calc(100vh-8rem)] md:h-[calc(100vh-9.1rem)]">
        <div className="flex flex-col py-2">
          <MessageBubble text="Hello!" isSender={false} time="10:30 AM" />
          <MessageBubble text="Hello!" isSender={false} time="10:30 AM" />
          <MessageBubble text="Hello!" isSender={false} time="10:30 AM" />
          <MessageBubble text="Hi there!" isSender={true} time="10:31 AM" />
          <MessageBubble text="Hi there!" isSender={true} time="10:31 AM" />
          <MessageBubble text="How are you?" isSender={false} time="10:32 AM" />
          <MessageBubble text="How are you?" isSender={false} time="10:32 AM" />
          <MessageBubble text="How are you?" isSender={false} time="10:32 AM" />
          <MessageBubble
            text="I'm good, thanks! You?"
            isSender={true}
            time="10:33 AM"
          />
          <MessageBubble
            text="I'm good, thanks! You?"
            isSender={true}
            time="10:33 AM"
          />
          <MessageBubble
            text="I'm good, thanks! You?"
            isSender={true}
            time="10:33 AM"
          />
          <MessageBubble
            text="Doing well, just working on some projects."
            isSender={false}
            time="10:34 AM"
          />
          <MessageBubble
            text="Sounds great! Let's catch up later."
            isSender={true}
            time="10:35 AM"
          />
          <MessageBubble
            text="Sure, talk to you later!"
            isSender={false}
            time="10:36 AM"
          />
          <MessageBubble text="Take care!" isSender={true} time="10:37 AM" />
          <MessageBubble text="Hello!" isSender={false} time="10:30 AM" />
          <MessageBubble text="Hi there!" isSender={true} time="10:31 AM" />
          <MessageBubble text="How are you?" isSender={false} time="10:32 AM" />
          <MessageBubble
            text="I'm good, thanks! You?"
            isSender={true}
            time="10:33 AM"
          />
          <MessageBubble
            text="Doing well, just working on some projects."
            isSender={false}
            time="10:34 AM"
          />
          <MessageBubble
            text="Sounds great! Let's catch up later."
            isSender={true}
            time="10:35 AM"
          />
          <MessageBubble
            text="Sure, talk to you later!"
            isSender={false}
            time="10:36 AM"
          />
          <MessageBubble text="Take care!" isSender={true} time="10:37 AM" />
          <MessageBubble text="Hello!" isSender={false} time="10:30 AM" />
          <MessageBubble text="Hi there!" isSender={true} time="10:31 AM" />
          <MessageBubble text="How are you?" isSender={false} time="10:32 AM" />
          <MessageBubble
            text="I'm good, thanks! You?"
            isSender={true}
            time="10:33 AM"
          />
          <MessageBubble
            text="Doing well, just working on some projects."
            isSender={false}
            time="10:34 AM"
          />
          <MessageBubble
            text="Sounds great! Let's catch up later."
            isSender={true}
            time="10:35 AM"
          />
          <MessageBubble
            text="Sure, talk to you later!"
            isSender={false}
            time="10:36 AM"
          />
          <MessageBubble text="Take care!" isSender={true} time="10:37 AM" />
          <MessageBubble text="Hello!" isSender={false} time="10:30 AM" />
          <MessageBubble text="Hi there!" isSender={true} time="10:31 AM" />
          <MessageBubble text="How are you?" isSender={false} time="10:32 AM" />
          <MessageBubble
            text="I'm good, thanks! You?"
            isSender={true}
            time="10:33 AM"
          />
          <MessageBubble
            text="Doing well, just working on some projects."
            isSender={false}
            time="10:34 AM"
          />
          <MessageBubble
            text="Sounds great! Let's catch up later."
            isSender={true}
            time="10:35 AM"
          />
          <MessageBubble
            text="Sure, talk to you later!"
            isSender={false}
            time="10:36 AM"
          />
          <MessageBubble text="Take care!" isSender={true} time="10:37 AM" />
          <MessageBubble text="Hello!" isSender={false} time="10:30 AM" />
          <MessageBubble text="Hi there!" isSender={true} time="10:31 AM" />
          <MessageBubble text="How are you?" isSender={false} time="10:32 AM" />
          <MessageBubble
            text="I'm good, thanks! You?"
            isSender={true}
            time="10:33 AM"
          />
          <MessageBubble
            text="Doing well, just working on some projects."
            isSender={false}
            time="10:34 AM"
          />
          <MessageBubble
            text="Sounds great! Let's catch up later."
            isSender={true}
            time="10:35 AM"
          />
          <MessageBubble
            text="Sure, talk to you later!"
            isSender={false}
            time="10:36 AM"
          />
          <MessageBubble text="Take care!" isSender={true} time="10:37 AM" />
        </div>
      </ScrollArea>

      {/* Footer/Input Placeholder */}
      <div className="mt-1 px-4 h-14 fixed md:static bottom-3 w-full md:py-2 md:border-t">
        <ChatInput />
      </div>
    </div>
  );
}
