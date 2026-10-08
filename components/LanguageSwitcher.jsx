"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localeNames, locales } from "@/data/i18n";

// A disclosure menu drawn like the rest of the site: each language is a link to this same page in that language.
// The cookie remembers the choice for URLs that arrive without a language.
export function LanguageSwitcher({
  locale,
  label
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = event => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = event => {
      if (event.key !== "Escape") return;
      setOpen(false);
      rootRef.current?.querySelector("button")?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  const code = locale.toUpperCase();
  return <div ref={rootRef} className="languageSwitcher" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
      <button type="button" className="languageButton" aria-label={`${code} · ${label}`} aria-expanded={open} aria-controls="language-menu" onClick={() => setOpen(isOpen => !isOpen)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
        </svg>
        <span aria-hidden="true">{code}</span>
        <svg className="languageChevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && <ul id="language-menu" className="languageMenu">
          {locales.map(option => <li key={option}>
              <Link href={pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${option}`)} hrefLang={option} lang={option} aria-current={option === locale ? "true" : undefined} onClick={() => {
            document.cookie = `lang=${option}; path=/; max-age=31536000; samesite=lax`;
            setOpen(false);
          }}>
                <span className="languageCode" aria-hidden="true">{option.toUpperCase()}</span>
                {localeNames[option]}
              </Link>
            </li>)}
        </ul>}
    </div>;
}
