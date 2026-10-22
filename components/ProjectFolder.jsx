"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import Folder from "./Folder";
import { ProjectCard } from "./ProjectCard";

// On phones the hero's projects button skips the casino: it opens the folder and brings it into view.
export const openFolder = () => {
  const folder = document.querySelector(".projectFolder");
  if (!folder.querySelector("[data-open]")) folder.querySelector(".folder-stage").click();
  // After the open state renders, since opening makes room above the folder.
  requestAnimationFrame(() => folder.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "center"
  }));
};

// Where the picked card comes from and goes back to: up from the bottom on phones, a small rise on bigger screens.
const hidden = () => ({
  "--fade": 0,
  ...(window.matchMedia("(max-width: 620px)").matches ? { yPercent: 100 } : { opacity: 0, y: 24, scale: .96 })
});
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The casino button opens the project it draws, by index; set by the one ProjectFolder on the page.
let openProject;
export const showProject = index => openProject?.(index);

// The projects live in a folder; picking one opens its full card in a dialog.
export function ProjectFolder({
  label,
  hint,
  close: closeLabel,
  projects,
  t
}) {
  const dialogRef = useRef(null);
  const [shown, setShown] = useState(null);
  // Bigger cards out of the folder on wide screens (the room above it grows to match in globals.css), following the
  // screen as it's resized or turned.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px)");
    const sync = () => setWide(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const open = project => {
    const dialog = dialogRef.current;
    setShown(project);
    dialog.showModal();
    if (!reducedMotion()) gsap.fromTo(dialog, hidden(), {
      "--fade": 1,
      opacity: 1,
      y: 0,
      yPercent: 0,
      scale: 1,
      duration: .4,
      ease: "power3.out"
    });
  };
  openProject = index => open(projects[index]);
  const close = () => {
    const dialog = dialogRef.current;
    if (reducedMotion()) return dialog.close();
    gsap.to(dialog, {
      ...hidden(),
      duration: .25,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => {
        dialog.close();
        gsap.set(dialog, { clearProps: "all" });
      }
    });
  };
  // Side by side with the résumé, the folder sits under the room the taller résumé leaves above it (globals.css), which
  // reads as empty while it's closed. So there it opens by itself the first time the section comes into view, and the
  // projects rise into that room; after that it's the visitor's to close.
  const rootRef = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1200px)").matches) return;
    const root = rootRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (!root.querySelector("[data-open]")) root.querySelector(".folder-stage").click();
    }, {
      threshold: .35
    });
    observer.observe(root.parentElement);
    return () => observer.disconnect();
  }, []);
  // Opening eases in room above the folder (padding transition in globals.css); while it grows, the page scrolls by the
  // same amount every frame, so the folder stays put and the page above slides up. Off screen (the hero button) there is
  // nothing to hold, and openFolder's smooth scroll must not be fought. Side by side with the résumé nothing moves, and
  // the folder opens by itself mid-scroll, which this must not fight either.
  const holdFolder = () => {
    if (window.matchMedia("(min-width: 1200px)").matches) return;
    const folder = document.querySelector(".projectFolder .folder-root");
    const before = folder.getBoundingClientRect().top;
    if (before < 0 || before > window.innerHeight) return;
    const until = performance.now() + 550;
    const hold = () => {
      window.scrollBy({
        top: folder.getBoundingClientRect().top - before,
        behavior: "instant"
      });
      if (performance.now() < until) requestAnimationFrame(hold);
    };
    requestAnimationFrame(hold);
  };
  return <div ref={rootRef} className="projectFolder">
      <Folder label={label} color="#2a62d6" layout={wide ? "wide" : "grid"} tilt={0} draggable={false} closeOnOutsideClick={false} onOpenChange={holdFolder} items={projects.map(project => ({
      content: <div className="folderProject">
            <img src={project.image} alt="" draggable={false} />
            <span>{project.title}</span>
          </div>
    }))} zoomOnClick={false} onItemClick={(_, index) => open(projects[index])} />
      <p>{hint}</p>
      {/* Esc and a click on the scrim close it through the same animation as the button. */}
      <dialog ref={dialogRef} className="projectDialog" aria-label={shown?.title} onClose={() => setShown(null)} onCancel={e => {
      e.preventDefault();
      close();
    }} onClick={e => e.target === e.currentTarget && close()}>
        <button type="button" className="projectDialogClose" aria-label={closeLabel} onClick={close}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        {shown && <ProjectCard project={shown} t={t} />}
      </dialog>
    </div>;
}
