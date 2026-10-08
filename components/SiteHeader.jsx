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
    // A section counts as current while it crosses the middle band of the viewport.
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setActive(SECTIONS.includes(entry.target.id) ? entry.target.id : null);
    }), {
      rootMargin: "-45% 0px -50% 0px"
    });
    ["top", ...SECTIONS].forEach(id => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => {
      observer.disconnect();
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
