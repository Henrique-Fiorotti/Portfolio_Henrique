"use client";

import { useEffect } from "react";
import { profile } from "@/data/portfolio";
const ART = String.raw`
 _   _ _____
| | | |  ___|
| |_| | |_
|  _  |  _|  _
|_| |_|_|   (_)
`;
let signed = false;

// For whoever opens DevTools on a developer's portfolio.
export function ConsoleSignature({
  message
}) {
  useEffect(() => {
    if (signed) return;
    signed = true;
    console.log(`%c${ART}`, "color:#004aad;font:700 12px/1.2 monospace");
    console.log(`%c${message}\n%c${profile.email}\n${profile.github}`, "font:600 13px sans-serif", "color:#004aad;font:12px monospace");
  }, [message]);
  return null;
}
