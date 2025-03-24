// components/ToggleComponent.tsx
"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
      className="outline"
      variant={"outline"}
    >
      {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </Button>
  );
};

export default ModeToggle;
