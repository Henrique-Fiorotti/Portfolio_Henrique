"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "portfolio-theme";
const getTheme = () => document.documentElement.dataset.theme || "light";
const getServerTheme = () => null;
const subscribeTheme = callback => {
  window.addEventListener("portfolio-theme-change", callback);
  return () => window.removeEventListener("portfolio-theme-change", callback);
};

const applyTheme = theme => {
  const root = document.documentElement;
  const isDark = theme === "dark";

  root.classList.toggle("dark", isDark);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute("content", isDark ? "#0f0e16" : "#eeeaff");
  window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: theme }));
};

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);

  useEffect(() => {
    const root = document.documentElement;
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const initialTheme = root.dataset.theme ?? (colorScheme.matches ? "dark" : "light");

    const followSystemTheme = event => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch { /* Theme changes still work when storage is unavailable. */ }
      const systemTheme = event.matches ? "dark" : "light";
      applyTheme(systemTheme);
    };

    applyTheme(initialTheme);
    colorScheme.addEventListener("change", followSystemTheme);

    return () => colorScheme.removeEventListener("change", followSystemTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch { /* Persistence is optional. */ }
    applyTheme(nextTheme);
  };

  const isDark = theme === "dark";

  return <button
    type="button"
    className="windowLayoutControl themeToggle"
    onClick={toggleTheme}
    aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
    data-tooltip={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
  >
    {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
  </button>;
}
