
import React from "react";
import { useTheme } from "./ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const isDarkMode = theme === "dark";
  
  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
    
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
      description: `The application theme has been set to ${newTheme} mode.`,
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
      <Switch 
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
      />
      <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700 dark:text-slate-400" />
    </div>
  );
}
