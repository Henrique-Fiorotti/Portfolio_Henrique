"use client";

import { useEffect, useState } from "react";

export function SiteHeader({ children }) {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let frame;
    const update = () => {
      const current = Math.max(0, window.scrollY);
      const difference = current - previousScrollY;
      if (current <= 24) setIsHidden(false);
      else if (Math.abs(difference) >= 6) setIsHidden(difference > 0);
      previousScrollY = current;
      frame = undefined;
    };
    const onScroll = () => {
      if (frame === undefined) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Keyboard focus reveals navigation, including when the header was scrolled away.
  return <header className={`siteHeader container ${isHidden ? "isHidden" : ""}`}
    onFocusCapture={() => setIsHidden(false)}>{children}</header>;
}
