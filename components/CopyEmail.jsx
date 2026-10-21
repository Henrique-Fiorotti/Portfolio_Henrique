"use client";

import { useEffect, useRef, useState } from "react";
export function CopyEmail({
  email,
  copiedLabel
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };
  return <div className="copyEmail">
      <button type="button" className="footerEmail" onClick={copy}>
        {email}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {copied ? <path d="m5 12.5 4.5 4.5L19 7.5" /> : <path d="M9 9h11v11H9zM5 15H4V4h11v1" />}
        </svg>
      </button>
      <span className="copyStatus" aria-live="polite">{copied && copiedLabel}</span>
    </div>;
}
