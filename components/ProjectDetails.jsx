import { StarStory } from "./StarStory";
import { caseStudies } from "@/data/case-studies";

export function ProjectDetails({ project, compact = false }) {
  const study = caseStudies[project.slug];
  const Heading = compact ? "h3" : "h2";
  return <div className="projectDetails">
    {study ? <>
      <p className="eyebrow">{study.context}</p>
      <p className="projectDetailsRole">{study.role}</p>
      <StarStory story={study.star} />
      <section><Heading>Implementação técnica</Heading><ul>{study.decisions.map(decision => <li key={decision}>{decision}</li>)}</ul></section>
    </> : <section><Heading>Sobre o projeto</Heading><p>{project.description}</p></section>}
    <section><Heading>Tecnologias utilizadas</Heading><p>{project.technologies.join(" · ")}</p></section>
    <section>
      <Heading>Explore a entrega</Heading>
      {study && <p>{study.evidence}</p>}
      <div className="directoryLinks">
        <a href={project.repository} target="_blank" rel="noreferrer">Ver código no GitHub ↗</a>
        {project.site && <a href={project.site} target="_blank" rel="noreferrer">Abrir demonstração ↗</a>}
      </div>
    </section>
  </div>;
}
