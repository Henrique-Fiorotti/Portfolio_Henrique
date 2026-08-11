"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "portfolio-theme";

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
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const initialTheme = root.dataset.theme ?? (colorScheme.matches ? "dark" : "light");

    const followSystemTheme = event => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const systemTheme = event.matches ? "dark" : "light";
      applyTheme(systemTheme);
      setTheme(systemTheme);
    };

    applyTheme(initialTheme);
    setTheme(initialTheme);
    colorScheme.addEventListener("change", followSystemTheme);

    return () => colorScheme.removeEventListener("change", followSystemTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    setTheme(nextTheme);
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
