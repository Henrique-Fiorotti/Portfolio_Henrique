"use client";

import { useEffect, useRef, useState } from "react";
export function CopyEmail({
  email,
  hint,
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
      <button type="button" className="footerEmail" onClick={copy}>{email}</button>
      <span className="copyStatus" aria-live="polite">{copied ? copiedLabel : hint}</span>
    </div>;
}
