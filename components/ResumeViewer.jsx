"use client";

import { gsap } from "gsap";
import { useRef } from "react";
const PDF = "/curriculo-henrique-fiorotti.pdf";

// A mini A4 sheet that opens into a full-size sheet in a modal. GSAP flies the sheet between the two positions
// (FLIP: measure both boxes, animate the difference), so the page visibly lifts off the section and settles back.
export function ResumeViewer({
  sheet,
  summary,
  labels
}) {
  const dialogRef = useRef(null);
  const thumbRef = useRef(null);
  const sheetRef = useRef(null);
  const overlayRef = useRef(null);
  const toolbarRef = useRef(null);
  const closeRef = useRef(null);
  const busy = useRef(false);
  // Whichever control opened the modal gets focus back when it closes (browsers differ on restoring it).
  const opener = useRef(null);
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fromThumb = () => {
    const thumb = thumbRef.current.getBoundingClientRect();
    const full = sheetRef.current.getBoundingClientRect();
    return {
      x: thumb.left - full.left,
      y: thumb.top - full.top,
      scale: thumb.width / full.width,
      transformOrigin: "top left"
    };
  };
  const open = event => {
    const dialog = dialogRef.current;
    if (busy.current || dialog.open) return;
    opener.current = event.currentTarget;
    dialog.showModal();
    dialog.scrollTop = 0;
    closeRef.current.focus();
    if (reducedMotion()) return;
    busy.current = true;
    gsap.fromTo(overlayRef.current, {
      opacity: 0
    }, {
      opacity: 1,
      duration: .3,
      ease: "power2.out"
    });
    gsap.fromTo(toolbarRef.current, {
      opacity: 0,
      y: -8
    }, {
      opacity: 1,
      y: 0,
      duration: .3,
      delay: .3,
      ease: "power2.out"
    });
    gsap.fromTo(sheetRef.current, fromThumb(), {
      x: 0,
      y: 0,
      scale: 1,
      duration: .65,
      ease: "power3.out",
      onComplete: () => {
        busy.current = false;
      }
    });
  };
  const close = () => {
    const dialog = dialogRef.current;
    if (busy.current || !dialog.open) return;
    if (reducedMotion()) {
      dialog.close();
      opener.current?.focus({
        preventScroll: true
      });
      return;
    }
    busy.current = true;
    dialog.scrollTop = 0;
    gsap.to(toolbarRef.current, {
      opacity: 0,
      duration: .15
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: .35,
      delay: .1,
      ease: "power2.in"
    });
    gsap.to(sheetRef.current, {
      ...fromThumb(),
      duration: .45,
      ease: "power3.in",
      onComplete: () => {
        dialog.close();
        opener.current?.focus({
          preventScroll: true
        });
        gsap.set([sheetRef.current, toolbarRef.current, overlayRef.current], {
          clearProps: "all"
        });
        busy.current = false;
      }
    });
  };
  return <div className="resumeStage">
      <div ref={thumbRef} className="sheetThumb">
        <div className="sheetThumbPage" aria-hidden="true" inert>{sheet}</div>
        <button type="button" className="sheetThumbButton" aria-label={labels.open} onClick={open}>
          <span className="sheetThumbHint" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            {labels.hint}
          </span>
        </button>
      </div>
      <div className="resumeSummary">
        {summary}
        <div className="resumeActions">
          <button type="button" className="button primary" onClick={open}>{labels.open}</button>
          <a className="button secondary" href={PDF} download="curriculo-henrique-fiorotti.pdf">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" /></svg>
            {labels.pdf}
          </a>
        </div>
      </div>
      <dialog ref={dialogRef} className="resumeDialog" aria-label={labels.title} onCancel={event => {
      event.preventDefault();
      close();
    }}>
        <div ref={overlayRef} className="resumeOverlay" onClick={close} />
        <div className="resumeDialogBody">
          <div ref={toolbarRef} className="resumeToolbar">
            <a className="button secondary" href={PDF} download="curriculo-henrique-fiorotti.pdf">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" /></svg>
              {labels.pdf}
            </a>
            <button ref={closeRef} type="button" className="button primary" onClick={close}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
              {labels.close}
            </button>
          </div>
          <div ref={sheetRef} className="resumeSheetFrame">{sheet}</div>
        </div>
      </dialog>
    </div>;
}
