"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      onClick={() => (isDark ? setTheme("light") : setTheme("dark"))}
      variant="outline"
      size="icon"
      className="w-10 h-10 rounded-full"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Mobile view - icon only */}
      <span className="sm:hidden">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </span>

      {/* Desktop view - icon and text */}
      <span className="hidden sm:flex items-center gap-2">
        {isDark ? (
          <>
            <Sun size={16} />
          </>
        ) : (
          <>
            <Moon size={16} />
          </>
        )}
      </span>
    </Button>
  );
};

export default ModeToggle;
