import React from "react";
import { Input } from "./ui/input";
import { Bell, Moon, Search } from "lucide-react";

export const Navbar_LG = () => {
  return (
    <div className="h-14 mx-3 border-b flex items-center justify-between px-7">
      <div>
        <Input />
      </div>
      <div className="flex items-center gap-7">
        <button className="cursor-pointer p-3">
          <Bell className="w-4 h-4" />
        </button>
        <button className="cursor-pointer p-3">
          <Moon className="w-4 h-4" />
        </button>
        <div className="min-w-[36px] min-h-[36px] w-9 h-9 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
          S
        </div>
      </div>
    </div>
  );
};

export const Navbar_SM = () => {
  return (
    <div className="h-14 border-b flex items-center justify-between px-3">
      <div>
        <button className="cursor-pointer bg-stone-800 p-2 border rounded-lg">
          <Search className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="cursor-pointer p-2">
          <Bell className="w-5 h-5" />
        </button>
        <button className="cursor-pointer p-2">
          <Moon className="w-5 h-5" />
        </button>
        <div className="min-w-[36px] min-h-[36px] w-9 h-9 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
          S
        </div>
      </div>
    </div>
  );
};
