"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input"; // from shadcn
import { Button } from "@/components/ui/button";
import { MessageInput, messageSchema } from "@/lib/schemas/message-schema";
import { Send } from "lucide-react";
import useSendMsg from "@/hooks/useSendMsg";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { toastStyles } from "@/lib/ToastStyle";

export function ChatInput() {
  const { register, handleSubmit, reset, watch } = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
  });
  const { chatId }: { chatId: string } = useParams();
  const sendMsg = useSendMsg();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: MessageInput) => {
    setLoading(true);
    try {
      const res = await sendMsg(chatId, data.message);
      console.log(res);

      if (!res?.success) {
        toast.error(<span>{res?.message}</span>, {
          style: toastStyles.danger as React.CSSProperties,
        });
        return;
      }

      reset();
    } catch (error) {
      console.error("Failed to load conversation list", error);
    } finally {
      setLoading(false);
    }
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
        disabled={loading}
      />
      <Button
        type="submit"
        disabled={!watch("message")?.length || loading}
        className="cursor-pointer p-2 h-10 rounded-lg border dark:text-stone-800 dark:bg-white"
      >
        <Send className="w-5 h-5 md:w-5 md:h-5" />
      </Button>
    </form>
  );
}
