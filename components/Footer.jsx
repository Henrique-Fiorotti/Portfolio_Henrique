import { profile } from "@/data/portfolio";
import { ConsoleSignature } from "./ConsoleSignature";
import { CopyEmail } from "./CopyEmail";
export function Footer({
  t
}) {
  return <footer id="contato" className="container footer">
      <ConsoleSignature message={t.console} />
      <div className="panel footerContent">
        <div>
          <h2>{t.footerTitle}</h2>
          <CopyEmail email={profile.email} hint={t.copyHint} copiedLabel={t.copied} />
        </div>
        <nav className="footerLinks" aria-label={t.footerNav}>
          <a href={`mailto:${profile.email}`}>{t.sendEmail}</a>
          <a href="#curriculo">{t.nav.resume}</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
      </div>
      <p className="copyright">© {new Date().getFullYear()} Henrique Fiorotti · {t.builtWith}</p>
    </footer>;
}
