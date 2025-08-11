import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

const ThemeButton = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  return (
    <button
      className=" fixed bottom-6 right-6 md:bottom-10 md:right-15 cursor-pointer dark:hover:bg-stone-800 dark:bg-stone-900 p-2 rounded-lg border"
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
  );
};

export default ThemeButton;
