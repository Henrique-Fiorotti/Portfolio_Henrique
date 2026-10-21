"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";
import { LanguageSwitcher } from "./LanguageSwitcher";
import StaggeredMenu from "./StaggeredMenu";
import { GITHUB, LINKEDIN } from "./icons";
const SECTIONS = ["projetos", "sobre", "curriculo", "contato"];
export function SiteHeader({
  locale,
  t
}) {
  const [active, setActive] = useState(null);
  const headerRef = useRef(null);
  // The bar slides away while scrolling down and returns after a deliberate scroll back up (REVEAL px),
  // near the top of the page, when the mouse goes to the top edge, or when keyboard focus lands in it.
  useEffect(() => {
    const header = headerRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const REVEAL = 120;
    let lastY = window.scrollY;
    let lowest = lastY;
    let scrolledAway = false;
    let pointerAtTop = false;
    let hidden = false;
    gsap.set(header, {
      "--hide": "0px"
    });
    const apply = () => {
      const hide = scrolledAway && !pointerAtTop && !header.matches(":has(:focus-visible)");
      if (hide === hidden) return;
      hidden = hide;
      // --hide pulls the sticky top above the viewport.
      gsap.to(header, {
        "--hide": hide ? `${header.offsetHeight + 24}px` : "0px",
        duration: reduce.matches ? 0 : hide ? .3 : .45,
        ease: hide ? "power2.in" : "power3.out",
        overwrite: true
      });
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY) {
        lowest = y;
        if (y > 80) scrolledAway = true;
      } else if (y < 80 || lowest - y > REVEAL) scrolledAway = false;
      lastY = y;
      apply();
    };
    const onPointerMove = event => {
      if (event.pointerType !== "mouse") return;
      pointerAtTop = event.clientY < header.offsetHeight + 40;
      apply();
    };
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    window.addEventListener("pointermove", onPointerMove, {
      passive: true
    });
    header.addEventListener("focusin", apply);
    header.addEventListener("focusout", apply);
    return () => {
      gsap.killTweensOf(header);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      header.removeEventListener("focusin", apply);
      header.removeEventListener("focusout", apply);
    };
  }, []);
  useEffect(() => {
    // The current section is the last one whose top has reached the line where anchor jumps land
    // (scroll-margin-top in globals.css, plus slack); at the bottom of the page the last section wins,
    // since the footer can never scroll that high.
    const update = () => {
      const ids = ["top", ...SECTIONS];
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const current = atBottom ? ids.at(-1) : ids.findLast(id => document.getElementById(id)?.getBoundingClientRect().top <= 100);
      setActive(SECTIONS.includes(current) ? current : null);
    };
    update();
    window.addEventListener("scroll", update, {
      passive: true
    });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const link = (id, label) => <a key={id} className="topbarLink" href={`#${id}`} aria-current={active === id ? "location" : undefined}>{label}</a>;
  const brand = <a className="brand" href="#top" aria-label={`HF. ${t.home}`}>HF<span>.</span></a>;
  const labels = {
    projetos: t.nav.projects,
    sobre: t.nav.about,
    curriculo: t.nav.resume,
    contato: t.nav.contact
  };
  // Phones get the full-screen staggered menu instead of the top bar; CSS swaps them at 620px.
  return <>
    <StaggeredMenu className="phoneMenu" isFixed logo={brand} closeLabel={t.close} items={SECTIONS.map(id => ({
      label: labels[id],
      link: `#${id}`,
      current: active === id ? "location" : undefined
    }))} socialItems={[{
      label: <svg viewBox="0 0 24 24" aria-hidden="true"><path d={GITHUB} /></svg>,
      ariaLabel: "GitHub",
      link: profile.github
    }, {
      label: <svg viewBox="0 0 24 24" aria-hidden="true"><path d={LINKEDIN} /></svg>,
      ariaLabel: "LinkedIn",
      link: profile.linkedin
    }]} colors={["#B497CF", "#5227FF"]} accentColor="var(--blue)">
      <LanguageSwitcher locale={locale} label={t.language} />
    </StaggeredMenu>
    <header ref={headerRef} className="siteHeader container">
      <nav className="topbar" aria-label={t.navLabel}>
        <div className="topbarStart">{brand}</div>
        <div className="topbarLinks">{SECTIONS.map(id => link(id, labels[id]))}</div>
        <div className="topbarEnd">
          <LanguageSwitcher locale={locale} label={t.language} />
        </div>
      </nav>
    </header>
  </>;
}
