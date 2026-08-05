import { Footer } from "@/components/Footer";
import { CasinoProjectButton } from "@/components/CasinoProjectButton";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillPill } from "@/components/SkillPill";
import { WindowLayoutControls, WindowLayoutProvider } from "@/components/WindowLayout";
import { Window } from "@/components/Window";
import { profile, projects, skills, tools } from "@/data/portfolio";

export default function Home() {
  return (
    <WindowLayoutProvider>
    <main>
      <header className="siteHeader container">
        <a className="brand" href="#top">HF<span>.</span></a>
        <div className="siteHeaderActions">
        <nav aria-label="Navegação principal">
          <a href="#sobre">Sobre</a>
          <a href="#projetos">Projetos</a>
          <a href="/curriculo">Currículo</a>
        </nav>
        <WindowLayoutControls />
        </div>
      </header>

      <div id="top" className="container">
        <Window title="Portfolio.exe" className="heroWindow">
          <section className="hero">
            <div className="portrait" aria-hidden="true">
              <img className="mb-20" src="/images/user.svg" alt="Henrique Fiorotti" />
            </div>
            <div className="heroContent">
              <p className="eyebrow">Opa, eu sou</p>
              <h1>Henrique<br /><span>Fiorotti</span></h1>
              <p className="role">Desenvolvedor de sistemas & criador de experiências digitais</p>
              <p className="heroText">Transformo ideias em interfaces responsivas, automações e aplicações web funcionais.</p>
              <div className="heroActions">
                <CasinoProjectButton />
                <a className="button secondary" href={`mailto:${profile.email}`}>Entrar em contato</a>
              </div>
              <div className="socialLinks">
                <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              </div>
            </div>
          </section>
        </Window>
      </div>

      <section id="sobre" className="container aboutSection">
        <Window title="Sobre-mim.txt">
          <div className="aboutGrid">
            <div>
              <p className="eyebrow">Perfil</p>
              <h2>Curiosidade, código e atenção aos detalhes.</h2>
            </div>
            <p>{profile.about}</p>
          </div>
          <div className="skillColumns">
            <div><h3>Hard skills</h3><div className="pillList">{skills.map((skill) => <SkillPill key={skill} name={skill} />)}</div></div>
            <div><h3>Ferramentas</h3><div className="pillList">{tools.map((tool) => <SkillPill key={tool} name={tool} />)}</div></div>
          </div>
        </Window>
      </section>

      <section id="projetos" className="container projectsSection">
        <div className="sectionHeading">
          <div><p className="eyebrow">Trabalhos selecionados</p><h2>Projetos</h2></div>
          <p>Uma seleção de aplicações, experiências visuais e estudos de desenvolvimento.</p>
        </div>
        <div className="projectsGrid">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
      </section>

      <Footer />
    </main>
    </WindowLayoutProvider>
  );
}
