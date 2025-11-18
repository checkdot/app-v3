"use client"

import Moon from "./svgs/Moon"
import Sun from "./svgs/Sun"
import { useQuery } from "@tanstack/react-query"

const ThemeSwitchButton = () => {
  useQuery({
    queryKey: ["theme"],
    queryFn: () => {
      const theme = localStorage.getItem("theme")
      if (theme) {
        document.documentElement.classList.add(theme)
      }
      return theme
    },
  })

  const onToggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    )
  }

  return (
    <button
      className="py-2 px-3 cursor-pointer text-[#0f59d1] dark:text-[#eee] hover:text-[#eee] dark:hover:text-[#10101a] rounded-lg transition-all duration-150"
      onClick={onToggleTheme}
    >
      <Moon className="size-4 hidden dark:block" />
      <Sun className="size-4 dark:hidden" />
    </button>
  )
}

export default ThemeSwitchButton
