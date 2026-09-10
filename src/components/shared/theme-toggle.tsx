"use client"

import {
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({
  className,
}: ThemeToggleProps) {
  const {
    resolvedTheme,
    setTheme,
  } = useTheme()

  function toggleTheme() {
    const currentTheme =
      resolvedTheme === "dark"
        ? "dark"
        : "light"

    setTheme(
      currentTheme === "dark"
        ? "light"
        : "dark"
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      aria-label="Toggle color theme"
      onClick={toggleTheme}
    >
      <Sun className="size-5 dark:hidden" />

      <Moon className="hidden size-5 dark:block" />

      <span className="sr-only">
        Toggle color theme
      </span>
    </Button>
  )
}