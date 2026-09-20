import { profile, projects } from "@/data/portfolio";
import Link from "next/link";
import { StaticWindow as Window } from "./StaticWindow";
export function Footer() {
  return <footer className="container footer">
      <Window title="Contato.exe" showMaximize={false}>
        <div className="footerContent">
          <div>
            <p className="eyebrow">Vamos conversar?</p>
            <h2>Tenho interesse em novos projetos e oportunidades.</h2>
            <a className="footerEmail" href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
          <nav className="footerLinks" aria-label="Links do rodapé">
            <Link href="/curriculo">Currículo</Link>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            {projects.slice(0, 2).map(project => <a key={project.slug} href={project.repository} target="_blank" rel="noreferrer">{project.title}</a>)}
          </nav>
        </div>
      </Window>
      <p className="copyright">© {new Date().getFullYear()} Henrique Fiorotti · Desenvolvido com Next.js</p>
    </footer>;
}
