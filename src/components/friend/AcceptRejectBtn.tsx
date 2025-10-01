import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { toastStyles } from "@/lib/ToastStyle";
import useAcceptRejectRequest from "@/hooks/useAcceptRejectRequest";
import clsx from "clsx";
import Link from "next/link";
import { FriendRequestListResponse } from "@/lib/types/serverResponse";

const AcceptRejectBtn = ({
  userId,
  setPendingRequests,
  setOpen,
}: {
  userId: string;
  setPendingRequests: Dispatch<SetStateAction<FriendRequestListResponse[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const { acceptRequestFn, rejectRequestFn } = useAcceptRejectRequest();
  const [isAccept, setIsAccept] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    const res = await acceptRequestFn(userId);
    if (!res.success) {
      toast.error(<span>{res.message}</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    setIsAccept(true);
    toast.success(<span>{res.message}</span>, {
      style: toastStyles.success as React.CSSProperties,
    });
  };

  const handleReject = async () => {
    setLoading(true);
    const res = await rejectRequestFn(userId);
    if (!res.success) {
      toast.error(<span>{res.message}</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    setPendingRequests((prev) => {
      return prev.filter((item) => item.userId !== userId);
    });
    toast.success(<span>{res.message}</span>, {
      style: toastStyles.success as React.CSSProperties,
    });
  };

  return !isAccept ? (
    <div className={clsx("flex items-center gap-2", false && "hidden")}>
      <Button
        disabled={loading}
        onClick={handleReject}
        className="text-xs px-3 cursor-pointer w-24 bg-stone-200 hover:bg-stone-300 text-black dark:bg-stone-700 dark:text-white dark:hover:bg-stone-600"
      >
        Reject
      </Button>
      <Button
        disabled={loading}
        onClick={handleAccept}
        className="text-xs px-3 cursor-pointer w-24"
      >
        Accept
      </Button>
    </div>
  ) : (
    <Link href={`/chat/${userId}`}>
      <Button
        onClick={() => setOpen(false)}
        className=" px-3 cursor-pointer w-24 bg-transparent hover:bg-transparent border-2 font-bold text-black dark:text-white"
      >
        Chat
      </Button>
    </Link>
  );
};

export default AcceptRejectBtn;
