import React, { useState } from "react";
import { Button } from "../ui/button";
import useSendCancelRequest from "@/hooks/useSendCancelRequest";
import { toast } from "sonner";
import { toastStyles } from "@/lib/ToastStyle";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const AddFriendBtn = ({
  id,
  friendStatus,
}: {
  id: string;
  friendStatus?: "accepted" | "pending" | undefined;
}) => {
  const { sendRequestFn, cancelRequestFn } = useSendCancelRequest();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(friendStatus);

  const handleAddFriend = async () => {
    setLoading(true);
    const res = await sendRequestFn(id);
    if (!res.success) {
      toast.error(<span>{res.message}</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
      setLoading(false);
      return;
    }
    setStatus("pending");
    setLoading(false);

    toast.success(<span>{res.message}</span>, {
      style: toastStyles.success as React.CSSProperties,
    });
  };

  const handleCancelRequest = async () => {
    setLoading(true);
    const res = await cancelRequestFn(id);
    if (!res.success) {
      toast.error(<span>{res.message}</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
      setLoading(false);
      return;
    }
    setStatus(undefined);
    setLoading(false);

    toast.success(<span>{res.message}</span>, {
      style: toastStyles.success as React.CSSProperties,
    });
  };

  return status === undefined ? (
    <Button
      onClick={handleAddFriend}
      disabled={loading}
      className="text-xs px-3 cursor-pointer w-24"
    >
      {loading ? <Loader2 className=" animate-spin" /> : "Add Friend"}
    </Button>
  ) : friendStatus === "accepted" ? (
    <Link href={`/chat/${id}`}>
      <Button className=" px-3 cursor-pointer w-24 bg-transparent hover:bg-transparent border-2 font-bold text-black dark:text-white">
        Chat
      </Button>
    </Link>
  ) : (
    <Button
      className="text-xs px-3 cursor-pointer w-24 bg-stone-200 hover:bg-stone-300 text-black dark:bg-stone-700 dark:text-white dark:hover:bg-stone-600"
      disabled={loading}
      onClick={handleCancelRequest}
    >
      {loading ? <Loader2 className=" animate-spin" /> : "Cancel"}
    </Button>
  );
};

export default AddFriendBtn;
