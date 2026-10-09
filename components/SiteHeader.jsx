"use client";

import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
const SECTIONS = ["projetos", "sobre", "curriculo", "contato"];
export function SiteHeader({
  locale,
  t
}) {
  const [active, setActive] = useState(null);
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
  const link = (id, label) => <a className="topbarLink" href={`#${id}`} aria-current={active === id ? "location" : undefined}>{label}</a>;
  return <header className="siteHeader container">
      <nav className="topbar" aria-label={t.navLabel}>
        <div className="topbarStart">
          <a className="brand" href="#top" aria-label={`HF. ${t.home}`}>HF<span>.</span></a>
        </div>
        <div className="topbarLinks">
          {link("projetos", t.nav.projects)}
          {link("sobre", t.nav.about)}
          {link("curriculo", t.nav.resume)}
          {link("contato", t.nav.contact)}
        </div>
        <div className="topbarEnd">
          <LanguageSwitcher locale={locale} label={t.language} />
        </div>
      </nav>
    </header>;
}
