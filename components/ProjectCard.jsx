import { SkillPill } from "./SkillPill";
import { Window } from "./Window";
export function ProjectCard({
  project
}) {
  return <Window title={project.windowTitle} className="projectWindow">
      <article className="projectCard" style={{
      "--accent": project.accent
    }}>
        <a className="projectMedia" href={project.site ?? project.repository} target="_blank" rel="noreferrer" aria-label={`Abrir ${project.title}`}>
          <img src={project.image} alt={`Prévia do projeto ${project.title}`} />
          {project.video && <video src={project.video} muted loop autoPlay playsInline aria-hidden="true" />}
        </a>
        <div className="projectContent">
          <div>
            <p className="eyebrow">Projeto em destaque</p>
            <h3>{project.title}</h3>
            <p className="projectSubtitle">{project.subtitle}</p>
            <p>{project.description}</p>
          </div>
          <div className="projectSkills" aria-label="Tecnologias utilizadas">
            {project.technologies.map(technology => <SkillPill key={technology} name={technology} />)}
          </div>
          <div className="projectActions">
            {project.site && <a className="button primary" href={project.site} target="_blank" rel="noreferrer">Ver projeto</a>}
            <a className="button secondary" href={project.repository} target="_blank" rel="noreferrer">Código no GitHub</a>
          </div>
        </div>
      </article>
    </Window>;
}
