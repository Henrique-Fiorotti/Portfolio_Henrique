import { profile, projects } from "@/data/portfolio";
import { Window } from "./Window";
export function Footer() {
  return <footer className="container footer">
      <Window title="Contato.exe" interactive={false} showMaximize={false}>
        <div className="footerContent">
          <div>
            <p className="eyebrow">Vamos conversar?</p>
            <h2>Tenho interesse em novos projetos e oportunidades.</h2>
            <a className="footerEmail" href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
          <nav className="footerLinks" aria-label="Links do rodapé">
            <a href="/curriculo">Currículo</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            {projects.slice(0, 2).map(project => <a key={project.slug} href={project.repository} target="_blank" rel="noreferrer">{project.title}</a>)}
          </nav>
        </div>
      </Window>
      <p className="copyright">© {new Date().getFullYear()} Henrique Fiorotti · Desenvolvido com Next.js</p>
    </footer>;
}
