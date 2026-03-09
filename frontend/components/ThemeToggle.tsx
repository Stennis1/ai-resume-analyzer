"use client";

import { useState, useSyncExternalStore } from "react";

type ThemeMode = "light" | "dark";

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  window.localStorage.setItem("theme-preference", theme);
}

function subscribe() {
  return () => undefined;
}

export default function ThemeToggle() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [, setTheme] = useState<ThemeMode>("light");

  const activeTheme: ThemeMode | null = hydrated
    ? document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
    : null;

  function toggleTheme() {
    const nextTheme = activeTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-[0_10px_30px_-18px_var(--shadow-strong)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
      aria-label="Toggle light and dark mode"
    >
      <span className="text-base leading-none">
        {activeTheme ? (activeTheme === "dark" ? "☀" : "◐") : "◐"}
      </span>
      <span>
        {activeTheme
          ? activeTheme === "dark"
            ? "Light mode"
            : "Dark mode"
          : "Theme"}
      </span>
    </button>
  );
}
