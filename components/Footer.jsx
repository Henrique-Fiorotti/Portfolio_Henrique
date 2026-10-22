import { profile } from "@/data/portfolio";
import { ConsoleSignature } from "./ConsoleSignature";
import { CopyEmail } from "./CopyEmail";
import { GITHUB, LINKEDIN } from "./icons";
const MAIL = "M3 5h18v14H3zM3 6l9 7 9-7";
export function Footer({
  t
}) {
  // Icon only, named for screen readers and on hover.
  const link = (href, label, path) => <a href={href} aria-label={label} title={label} {...href.startsWith("http") && {
    target: "_blank",
    rel: "noreferrer"
  }}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className={path === MAIL ? "mailIcon" : undefined}><path d={path} /></svg>
    </a>;
  return <footer id="contato" className="container footer">
      <ConsoleSignature message={t.console} />
      <div className="panel footerContent">
        <div>
          <h2>{t.footerTitle}</h2>
          <CopyEmail email={profile.email} copiedLabel={t.copied} />
        </div>
        <nav className="footerLinks" aria-label={t.footerNav}>
          {link(`mailto:${profile.email}`, t.sendEmail, MAIL)}
          {link(profile.github, "GitHub", GITHUB)}
          {link(profile.linkedin, "LinkedIn", LINKEDIN)}
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
