"use client";

import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import useSearchUser from "@/hooks/useSearchUser";
import AddFriendBtn from "./AddFriendBtn";
import { SearchUserResponse } from "@/lib/types/serverResponse";

export function SearchFriend() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchUserResponse[]>([]);
  const searchUserFn = useSearchUser();

  const searchUser = async (username: string) => {
    try {
      const res = await searchUserFn(username);
      setUsers(res?.data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      searchUser(value);
    }, 500),
    []
  );

  useEffect(() => {
    if (query.trim().length > 0) {
      debouncedSearch(query);
    } else {
      setUsers([]);
    }

    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  return (
    <>
      <div
        className="text-muted-foreground text-sm"
        onClick={() => setOpen(true)}
      >
        <div className=" w-80 hidden md:flex items-center justify-start bg-input/50 border rounded-md gap-3 py-2 px-3">
          <Search className="w-5 h-5" />
          <div>Search Friend...</div>
        </div>
        <button className=" md:hidden cursor-pointer dark:bg-stone-800 p-2 border rounded-lg">
          <Search className="w-5 h-5" />
        </button>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type username..."
          onValueChange={(val) => setQuery(val)}
        />
        <CommandList className="my-2">
          {users?.length === 0 && <CommandEmpty>No users found.</CommandEmpty>}

          {users?.map((user) => {
            return (
              <div
                className=" flex items-center justify-between px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 duration-100 rounded-lg mx-2"
                key={user._id}
              >
                <div className=" flex items-center gap-4">
                  <span className=" w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    S
                  </span>
                  <span className=" font-semibold">@{user.username}</span>
                </div>
                <AddFriendBtn friendStatus={user.status} id={user._id} setOpen={setOpen} />
              </div>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
