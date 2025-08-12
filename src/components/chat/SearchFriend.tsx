"use client";

import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";

export function SearchFriend() {
  const [open, setOpen] = useState(false);

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
        <CommandInput placeholder="Type username..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <span className=" w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                S
              </span>
              <span className=" font-semibold">@shailesh</span>
            </CommandItem>
            <CommandItem>
              <span className=" w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                R
              </span>
              <span className=" font-semibold">@rohan</span>
            </CommandItem>
            <CommandItem>
              <span className=" w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                R
              </span>
              <span className=" font-semibold">@raj</span>
            </CommandItem>
            <CommandItem>
              <span className=" w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                S
              </span>
              <span className=" font-semibold">@sangam</span>
            </CommandItem>
            <CommandItem>
              <span className=" w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                R
              </span>
              <span className=" font-semibold">@rohit</span>
            </CommandItem>
            <CommandItem>
              <span className=" w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                V
              </span>
              <span className=" font-semibold">@virat</span>
            </CommandItem>
            <CommandItem>
              <span className=" w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                R
              </span>
              <span className=" font-semibold">@rishabh</span>
            </CommandItem>
            <CommandItem>
              <span className=" w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                S
              </span>
              <span className=" font-semibold">@suryakumar</span>
            </CommandItem>
            <CommandItem>
              <span className=" w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                S
              </span>
              <span className=" font-semibold">@shailesh</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
