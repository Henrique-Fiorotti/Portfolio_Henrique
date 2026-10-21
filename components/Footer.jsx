import { profile } from "@/data/portfolio";
import { ConsoleSignature } from "./ConsoleSignature";
import { CopyEmail } from "./CopyEmail";
const OUT = "M7 17 17 7M8 7h9v9";
const DOWN = "M12 5v14m0 0 6-6m-6 6-6-6";
export function Footer({
  t
}) {
  const link = (href, label, arrow = OUT) => <a href={href} {...href.startsWith("http") && {
    target: "_blank",
    rel: "noreferrer"
  }}>
      {label}
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={arrow} /></svg>
    </a>;
  return <footer id="contato" className="container footer">
      <ConsoleSignature message={t.console} />
      <div className="panel footerContent">
        <div>
          <h2>{t.footerTitle}</h2>
          <CopyEmail email={profile.email} copiedLabel={t.copied} />
        </div>
        <nav className="footerLinks" aria-label={t.footerNav}>
          {link(`mailto:${profile.email}`, t.sendEmail)}
          {link("#curriculo", t.nav.resume, DOWN)}
          {link(profile.github, "GitHub")}
          {link(profile.linkedin, "LinkedIn")}
        </nav>
        <div className="footerBottom">
          <p>© {new Date().getFullYear()} Henrique Fiorotti · {t.builtWith}</p>
          <a className="footerTop" href="#" aria-label={t.home}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m0 0-6 6m6-6 6 6" /></svg>
          </a>
        </div>
      </div>
    </footer>;
}
