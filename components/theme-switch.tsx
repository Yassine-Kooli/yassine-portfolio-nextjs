"use client";

import { useTheme } from "@/context/theme-context";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { useTranslation } from "@/lib/hooks";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      className="flex items-center justify-center rounded-full bg-white p-2 text-gray-700 transition hover:text-primary-600 hover:scale-110 active:scale-105 dark:bg-white/10 dark:text-white/60 dark:hover:text-primary-400"
      onClick={toggleTheme}
      aria-label={theme === "light" ? t("theme.dark") : t("theme.light")}
    >
      {theme === "light" ? <BsSun className="text-lg" /> : <BsMoon className="text-lg" />}
    </button>
  );
}
