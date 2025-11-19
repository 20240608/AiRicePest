'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, Check } from "lucide-react";
import { useTheme } from "./theme-provider";

const themes = [
  { value: 'light' as const, label: '浅色主题', color: 'bg-white' },
  { value: 'dark' as const, label: '深色主题', color: 'bg-gray-900' },
  { value: 'blue' as const, label: '蓝色主题', color: 'bg-blue-600' },
  { value: 'green' as const, label: '绿色主题', color: 'bg-green-600' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-5 w-5" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border ${t.color}`} />
              <span>{t.label}</span>
            </div>
            {theme === t.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
