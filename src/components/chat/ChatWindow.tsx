"use client";

import MessageBubble from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "./ChatInput";
import ChatHeader from "./ChatHeader";

type Props = {
  chatId: string;
};

export default function ChatWindow({ chatId }: Props) {
  return (
    <div className="md:px-4 flex flex-col relative h-[calc(100vh-4.8rem)]">
      {/* Header */}
      <ChatHeader />

      {/* Scrollable Message Area */}
      <ScrollArea className=" h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)]">
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
