"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function ProjectDetailsModal({ slug, title, subtitle, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const titleId = `project-dialog-title-${slug}`;

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return <>
    <a ref={triggerRef} className="button secondary projectDetailsTrigger" href={`/projetos/${slug}`}
      aria-haspopup="dialog" aria-label={`Saber mais sobre ${title}`} onClick={event => {
        // Keep a real page for no-JS access and modified clicks/new tabs.
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        setIsOpen(true);
      }}>Saber mais</a>
    {isOpen && createPortal(<dialog ref={dialogRef} className="projectDetailsDialog" aria-labelledby={titleId}
      data-lenis-prevent="" onClose={() => setIsOpen(false)}
      onClick={event => { if (event.target === event.currentTarget) setIsOpen(false); }}
      onKeyDown={event => {
        if (event.key !== "Tab") return;
        const focusable = event.currentTarget.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onFocusCapture={event => event.stopPropagation()}>
      <section className="projectDetailsPanel">
        <header className="projectDetailsHeader">
          <div><p className="eyebrow">Contexto, contribuição e entrega</p><h2 id={titleId}>{title}</h2></div>
          <button type="button" className="projectDetailsClose" onClick={() => setIsOpen(false)} aria-label={`Fechar detalhes de ${title}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </header>
        <div className="projectDetailsBody" data-lenis-prevent="">
          <p className="projectDetailsSubtitle">{subtitle}</p>
          {children}
        </div>
      </section>
    </dialog>, document.body)}
  </>;
}
