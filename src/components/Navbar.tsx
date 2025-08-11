import React from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { SearchFriend } from "./chat/SearchFriend";
import { useTheme } from "next-themes";

export const Navbar_LG = () => {
  const { setTheme, theme, systemTheme } = useTheme();

  return (
    <div className="h-14 mx-3 border-b flex items-center justify-between px-7">
      <div>
        <SearchFriend />
      </div>
      <div className="flex items-center gap-7">
        <button className="cursor-pointer p-3">
          <Bell className="w-5 h-5" />
        </button>
        <button
          className="cursor-pointer p-3"
          onClick={() =>
            setTheme(() =>
              theme === "system"
                ? systemTheme === "dark"
                  ? "light"
                  : "dark"
                : theme === "dark"
                  ? "light"
                  : "dark"
            )
          }
        >
          {theme === "system" ? (
            systemTheme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )
          ) : theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
        <div className="min-w-[36px] min-h-[36px] w-9 h-9 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
          S
        </div>
      </div>
    </div>
  );
};

export const Navbar_SM = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  return (
    <div className="h-14 border-b flex items-center justify-between px-3">
      <div>
        <SearchFriend />
      </div>
      <div className="flex items-center gap-2">
        <button className="cursor-pointer p-2">
          <Bell className="w-5 h-5" />
        </button>
        <button
          className="cursor-pointer p-2"
          onClick={() =>
            setTheme(() =>
              theme === "system"
                ? systemTheme === "dark"
                  ? "light"
                  : "dark"
                : theme === "dark"
                  ? "light"
                  : "dark"
            )
          }
        >
          {theme === "system" ? (
            systemTheme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )
          ) : theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
        <div className="min-w-[36px] min-h-[36px] w-9 h-9 bg-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
          S
        </div>
      </div>
    </div>
  );
};
