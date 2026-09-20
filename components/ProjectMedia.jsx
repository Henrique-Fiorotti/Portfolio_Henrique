"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function ProjectMedia({ title, image, video, href }) {
  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const pause = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    if (videoRef.current.readyState) videoRef.current.currentTime = 0;
  };
  const play = () => {
    const element = videoRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!element.getAttribute("src")) element.src = video;
    element.play().catch(() => {});
  };
  useEffect(() => {
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onVisibility = () => { if (document.hidden) pause(); };
    const onMotion = () => { if (preference.matches) pause(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); });
    observer.observe(mediaRef.current);
    document.addEventListener("visibilitychange", onVisibility);
    preference.addEventListener("change", onMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      preference.removeEventListener("change", onMotion);
    };
  }, [video]);
  return <a ref={mediaRef} className="projectMedia" href={href} target="_blank" rel="noreferrer"
    aria-label={`Abrir ${title}`} onPointerEnter={event => { if (event.pointerType === "mouse") play(); }}
    onPointerLeave={pause} onFocus={play} onBlur={pause}>
    <Image src={image} alt={`Prévia do projeto ${title}`} fill
      sizes="(max-width: 850px) 86vw, (min-width: 1417px) 540px, 40vw" />
    {video && <video ref={videoRef} muted loop playsInline preload="none" aria-hidden="true" />}
  </a>;
}
