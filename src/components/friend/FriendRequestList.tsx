"use client";

import { Bell } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useGetPendingFriendRequest from "@/hooks/useGetPendingFriendRequest";
import { useState } from "react";
import AcceptRejectBtn from "./AcceptRejectBtn";

export interface ResponseRequestList {
  _id: string;
  username: string;
  email: string;
  userId: string;
}

export function FriendRequestList() {
  const [open, setOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<ResponseRequestList[]>(
    []
  );
  const pendingFriendRequest = useGetPendingFriendRequest();

  const getPendingRequestFn = async () => {
    setOpen(true);
    try {
      const res = await pendingFriendRequest();
      setPendingRequests(res?.data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  return (
    <>
      <div className="text-sm relative" onClick={getPendingRequestFn}>
        <Bell className="w-5 h-5" />
        <span className="absolute bottom-0 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-stone-800 rounded-full"></span>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {pendingRequests?.map((friend) => (
              <CommandItem
                key={friend._id}
                className=" flex items-center justify-between"
              >
                <div className=" flex items-center gap-2">
                  <span className="w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    S
                  </span>
                  <span className="font-semibold">@{friend.username}</span>
                </div>
                <AcceptRejectBtn
                  setPendingRequests={setPendingRequests}
                  userId={friend?.userId}
                  setOpen={setOpen}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
