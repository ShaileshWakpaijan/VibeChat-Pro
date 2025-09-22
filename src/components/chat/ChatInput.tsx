"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input"; // from shadcn
import { Button } from "@/components/ui/button";
import { MessageInput, messageSchema } from "@/lib/schemas/message-schema";
import { Send } from "lucide-react";

export function ChatInput() {
  const { register, handleSubmit, reset, watch } = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: MessageInput) => {
    console.log(data.message);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-2 py-2 border-t md:border-none md:py-0 dark:bg-stone-950 bg-white"
    >
      <Input
        {...register("message")}
        placeholder="Type your message..."
        className="flex-1 h-10"
      />
      <Button
        type="submit"
        disabled={!watch("message")?.length}
        className="cursor-pointer p-2 h-10 rounded-lg border dark:text-stone-800 dark:bg-white"
      >
        <Send className="w-5 h-5 md:w-5 md:h-5" />
      </Button>
    </form>
  );
}
