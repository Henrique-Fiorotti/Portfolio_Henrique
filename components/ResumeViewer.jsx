"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import PaperCrumple from "./PaperCrumple";
const PDF = "/curriculo-henrique-fiorotti.pdf";
// Where approval stamps land on the sheet, in order: [x, y] as fractions of the sheet, then rotation in degrees.
const SPOTS = [[.66, .17, -12], [.32, .42, 8], [.68, .62, -6], [.3, .8, 10], [.62, .36, 14], [.38, .6, -14], [.7, .86, 4], [.5, .27, -4]];
const STAMP_WIDTH = .42;
// On phones the sheet shrinks to this share of its size as it is dragged left, small enough to sit in the square tray.
const PHONE_SHRINK = .28;
// One stamp picture serves both the HTML sheet and the 3D paper's texture, so the two always match.
const stampSrc = text => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120"><filter id="ink"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.5 1.45"/><feComposite in="SourceGraphic" operator="in"/></filter><g filter="url(#ink)" fill="none" stroke="#1d8a3c"><rect x="6" y="6" width="288" height="108" rx="14" stroke-width="8"/><rect x="20" y="20" width="260" height="80" rx="8" stroke-width="3"/><text x="150" y="76" text-anchor="middle" textLength="230" lengthAdjust="spacingAndGlyphs" font-family="Courier New, monospace" font-weight="700" font-size="46" fill="#1d8a3c" stroke="none">${text.toUpperCase()}</text></g></svg>`)}`;

// The résumé as a sheet of paper (a picture of the sheet; dragging it right crumples it) that opens into the full sheet in a modal.
// At rest the real HTML sheet sits over the 3D paper, so the text stays sharp at any zoom; the picture only shows while it moves.
// GSAP flies the sheet between the paper's resting spot and the modal (FLIP: measure both boxes, animate the difference).
export function ResumeViewer({
  sheet,
  image,
  labels
}) {
  const dialogRef = useRef(null);
  const thumbRef = useRef(null);
  const sheetRef = useRef(null);
  const overlayRef = useRef(null);
  const toolbarRef = useRef(null);
  const closeRef = useRef(null);
  const busy = useRef(false);
  const paperRef = useRef(null);
  const binRef = useRef(null);
  const approveRef = useRef(null);
  const toolRef = useRef(null);
  const stampImage = useRef(null);
  const [grabbing, setGrabbing] = useState(false);
  // idle → approving (parked on the green tray while the stamp comes down) → idle; or trashing → trashed, for good.
  const [phase, setPhase] = useState("idle");
  const [stamps, setStamps] = useState([]);
  const [homeKey, setHomeKey] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const trashed = phase.startsWith("trash");
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 620px)");
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const shrink = phone ? PHONE_SHRINK : 1;
  const stamp = stampSrc(labels.approved);
  useEffect(() => {
    const image = new Image();
    image.src = stamp;
    stampImage.current = image;
  }, [stamp]);
  const approve = park => {
    setPhase("approving");
    const round = Math.floor(stamps.length / SPOTS.length) * .03;
    const [x, y, rotation] = SPOTS[stamps.length % SPOTS.length];
    const spot = [x + round, y + round, rotation];
    const scene = paperRef.current;
    const sheetBox = thumbRef.current;
    const tool = toolRef.current;
    const sheetWidth = sheetBox.offsetWidth * shrink;
    // The tool's rubber (92 of its 120 units) lands exactly on the spot.
    gsap.set(tool, {
      left: scene.offsetWidth / 2 + park.x + (spot[0] - .5) * sheetWidth,
      top: scene.offsetHeight / 2 - park.y + (spot[1] - .5) * sheetBox.offsetHeight * shrink,
      width: sheetWidth * STAMP_WIDTH * 120 / 92,
      xPercent: -50,
      yPercent: -100,
      rotation,
      transformOrigin: "50% 100%"
    });
    gsap.timeline({
      delay: .9,
      onComplete: () => {
        setHomeKey(key => key + 1);
        setPhase("idle");
      }
    }).fromTo(tool, {
      y: -520,
      autoAlpha: 1
    }, {
      y: 0,
      duration: .45,
      ease: "power3.in"
    }).add(() => setStamps(list => [...list, spot])).to(tool, {
      scaleY: .9,
      duration: .07,
      yoyo: true,
      repeat: 1
    }).to(tool, {
      y: -520,
      duration: .45,
      ease: "power2.in"
    }, "+=.2").set(tool, {
      autoAlpha: 0
    }).to({}, {
      duration: .2
    });
  };
  // Called as the sheet is let go: over the bin it drops in, still crumpled; over the tray it parks for its stamp.
  const drop = ({
    x,
    y
  }) => {
    const scene = paperRef.current.getBoundingClientRect();
    const centerX = scene.left + scene.width / 2;
    const centerY = scene.top + scene.height / 2;
    const over = box => centerX + x >= box.left && centerX + x <= box.right && centerY - y >= box.top && centerY - y <= box.bottom;
    const bin = binRef.current.getBoundingClientRect();
    if (over(bin)) {
      setPhase("trashing");
      setTimeout(() => setPhase("trashed"), 1400);
      return {
        x: (bin.left + Math.min(bin.right, scene.right)) / 2 - centerX,
        y: centerY - (bin.top + bin.bottom) / 2,
        crumpled: true
      };
    }
    const tray = approveRef.current.getBoundingClientRect();
    if (over(tray)) {
      const limit = scene.width / 2 - thumbRef.current.offsetWidth * shrink / 2 - 12;
      const park = {
        x: Math.max(-limit, (tray.left + tray.right) / 2 - centerX),
        y: 0,
        shrunk: phone
      };
      approve(park);
      return park;
    }
  };
  // The marks laid over the HTML sheet, on the page and in the modal, in the same frame as the picture (794 × 1216).
  const marks = stamps.length > 0 && <div className="resumeStampLayer" aria-hidden="true">
      {stamps.map(([x, y, rotation], index) => <img key={index} src={stamp} alt="" style={{
      left: `${x * 100}%`,
      top: `${y * 100}%`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`
    }} />)}
    </div>;
  const paint = (context, width, height) => {
    const image = stampImage.current;
    if (!image?.complete) return;
    const w = width * STAMP_WIDTH;
    const h = w * 120 / 300;
    context.globalCompositeOperation = "multiply";
    for (const [x, y, rotation] of stamps) {
      context.save();
      context.translate(x * width, y * height);
      context.rotate(rotation * Math.PI / 180);
      context.drawImage(image, -w / 2, -h / 2, w, h);
      context.restore();
    }
    context.globalCompositeOperation = "source-over";
  };
  // Whichever control opened the modal gets focus back when it closes (browsers differ on restoring it).
  const opener = useRef(null);
  // The resting sheet is laid out at 794px (A4 at 96dpi) and scaled to the slot, like the picture it covers.
  useEffect(() => {
    const slot = thumbRef.current;
    const observer = new ResizeObserver(() => slot.style.setProperty("--scale", slot.offsetWidth / 794));
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);
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
      <div ref={paperRef} className="resumePaper" data-grabbing={grabbing || undefined} data-phase={phase}>
        {/* While the sheet is held, a bin slides in on the right (it crumples on the way) and a green approval tray on the left.
            Bin image: Microsoft Fluent Emoji 3D (MIT). */}
        <img ref={binRef} className="resumeBin" src="/images/wastebasket.png" alt="" width="256" height="256" />
        <div ref={approveRef} className="resumeApprove" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
          {labels.approved}
        </div>
        <svg ref={toolRef} className="resumeStampTool" viewBox="0 0 120 160" aria-hidden="true">
          <defs>
            <linearGradient id="stampWood" x1="0" x2="1">
              <stop offset="0" stopColor="#6b3f1c" />
              <stop offset=".45" stopColor="#c08042" />
              <stop offset="1" stopColor="#5e3618" />
            </linearGradient>
            <linearGradient id="stampMetal" x1="0" x2="1">
              <stop offset="0" stopColor="#7d838b" />
              <stop offset=".5" stopColor="#e6e9ee" />
              <stop offset="1" stopColor="#737981" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="30" rx="30" ry="26" fill="url(#stampWood)" />
          <rect x="48" y="50" width="24" height="46" rx="6" fill="url(#stampWood)" />
          <rect x="14" y="94" width="92" height="38" rx="6" fill="url(#stampWood)" />
          <rect x="10" y="130" width="100" height="10" rx="3" fill="url(#stampMetal)" />
          <rect x="14" y="140" width="92" height="14" rx="2" fill="#1d6b33" />
        </svg>
        <PaperCrumple onStateChange={state => setGrabbing(state === "holding")} onDrop={drop} onTap={open} onPaint={paint} paintKey={stamps.length} homeKey={homeKey} resetKey={resetKey} disabled={phase !== "idle"} src={image} alt={labels.title} width={360} height={551} sceneHeight={640} releaseBehavior="restore" crumpleAmount={0.95} shrinkTo={shrink} crumpleDuration={0.55} releaseDuration={0.4} foldCount={6} foldSharpness={0.6} wrinkleDepth={0.65} creaseStrength={0.18} paperColor="#f4f0e8" paperTexture={0.08} draggable returnToOrigin />
        <div ref={thumbRef} className="resumePaperSlot" aria-hidden="true" inert>
          <div className="resumePaperSheet">{sheet}</div>
          {marks}
        </div>
      </div>
      {phase === "trashed" && <button type="button" className="resumeRestore" aria-label={labels.restore} title={labels.restore} onClick={() => {
        setResetKey(key => key + 1);
        setStamps([]);
        setPhase("idle");
      }}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" /></svg>
        </button>}
      <div className="resumeActions">
        <button type="button" className="button primary" onClick={open} disabled={trashed}>{labels.open}</button>
        <a className="button secondary" href={PDF} download="curriculo-henrique-fiorotti.pdf">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" /></svg>
          {labels.pdf}
        </a>
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
          <div ref={sheetRef} className="resumeSheetFrame">{sheet}{marks}</div>
        </div>
      </dialog>
    </div>;
}
