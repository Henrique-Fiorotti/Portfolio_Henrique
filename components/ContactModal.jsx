"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { gsap } from "gsap";
import { profile } from "@/data/portfolio";

const contacts = [
  {
    key: "gmail",
    value: profile.email,
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`,
    external: true
  },
  {
    key: "linkedin",
    value: "henrique-berdoldi-fiorotti",
    href: profile.linkedin,
    external: true
  },
  {
    key: "github",
    value: "Henrique-Fiorotti",
    href: profile.github,
    external: true
  },
  {
    key: "telefone",
    value: profile.phone,
    href: profile.phoneHref,
    external: false
  }
];

export function ContactModal() {
  const dialogRef = useRef(null);
  const panelRef = useRef(null);
  const previousOverflowRef = useRef("");
  const isClosingRef = useRef(false);

  const openModal = () => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (!dialog || !panel || dialog.open) return;

    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([dialog, panel], { autoAlpha: 1, y: 0, scale: 1 });
      return;
    }
    gsap.fromTo(dialog, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "power2.out" });
    gsap.fromTo(panel,
      { y: 22, scale: 0.96, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.42, ease: "back.out(1.5)" }
    );
  };

  const closeModal = () => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (!dialog?.open || !panel || isClosingRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }

    isClosingRef.current = true;
    gsap.timeline({
      onComplete: () => {
        dialog.close();
        isClosingRef.current = false;
      }
    })
      .to(panel, { y: 12, scale: 0.97, autoAlpha: 0, duration: 0.2, ease: "power2.in" })
      .to(dialog, { autoAlpha: 0, duration: 0.16, ease: "power2.in" }, "<");
  };

  useEffect(() => () => {
    gsap.killTweensOf([dialogRef.current, panelRef.current]);
    if (dialogRef.current?.open) dialogRef.current.close();
    document.body.style.overflow = previousOverflowRef.current;
  }, []);

  return <>
      <button type="button" className="button secondary contactTrigger" onClick={openModal}>Entrar em contato</button>
      <dialog
        ref={dialogRef}
        className="contactDialog"
        aria-labelledby="contact-modal-title"
        onCancel={event => {
          event.preventDefault();
          closeModal();
        }}
        onClose={() => {
          document.body.style.overflow = previousOverflowRef.current;
        }}
        onMouseDown={event => {
          if (event.target === event.currentTarget) closeModal();
        }}
      >
        <section ref={panelRef} className="contactModal">
          <header className="contactModalHeader">
            <div>
              <span className="contactModalEyebrow">contato.json</span>
              <h2 id="contact-modal-title">Vamos conversar?</h2>
            </div>
            <button type="button" className="contactModalClose" onClick={closeModal} aria-label="Fechar contatos">
              <X aria-hidden="true" />
            </button>
          </header>
          <div className="contactModalBody">
            <p>Escolha o canal que for melhor para você.</p>
            <div className="contactJson" aria-label="Opções de contato em formato JSON">
              <div className="contactJsonBrace">&#123;</div>
              {contacts.map(({ key, value, href, external }, index) => <div className="contactJsonLine" key={key}>
                <span className="contactJsonKey">&quot;{key}&quot;</span>
                <span className="contactJsonPunctuation">: </span>
                <a
                  className="contactJsonValue"
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  aria-label={`Abrir contato por ${key}`}
                >
                  &quot;{value}&quot;
                  <ArrowUpRight aria-hidden="true" />
                </a>
                {index < contacts.length - 1 && <span className="contactJsonPunctuation">,</span>}
              </div>)}
              <div className="contactJsonBrace">&#125;</div>
            </div>
          </div>
        </section>
      </dialog>
    </>;
}
