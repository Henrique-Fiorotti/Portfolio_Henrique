"use client";

import { useRef, useState } from "react";
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

// Phones keep the projects in a folder (the grid is hidden there); tapping one opens its full card as a full-screen dialog.
export function ProjectFolder({
  label,
  hint,
  close,
  projects,
  t
}) {
  const dialogRef = useRef(null);
  const [shown, setShown] = useState(null);
  // Opening eases in room above the folder (padding transition in globals.css); while it grows, the page scrolls by the
  // same amount every frame, so the folder stays put and the page above slides up. Off screen (the hero button) there is
  // nothing to hold, and openFolder's smooth scroll must not be fought.
  const holdFolder = () => {
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
  return <div className="projectFolder">
      <Folder label={label} color="#2a62d6" layout="grid" tilt={0} draggable={false} closeOnOutsideClick={false} onOpenChange={holdFolder} items={projects.map(project => ({
      content: <div className="folderProject">
            <img src={project.image} alt="" draggable={false} />
            <span>{project.title}</span>
          </div>
    }))} zoomOnClick={false} onItemClick={(_, index) => {
      setShown(projects[index]);
      dialogRef.current.showModal();
    }} />
      <p>{hint}</p>
      <dialog ref={dialogRef} className="projectDialog" aria-label={shown?.title} onClose={() => setShown(null)}>
        <button type="button" className="projectDialogClose" aria-label={close} onClick={() => dialogRef.current.close()}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        {/* No slug: the card's id stays unique to the grid. */}
        {shown && <ProjectCard project={{
        ...shown,
        slug: undefined
      }} t={t} />}
      </dialog>
    </div>;
}
