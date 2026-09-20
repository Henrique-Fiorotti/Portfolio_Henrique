"use client";

import { useState } from "react";
import Link from "next/link";

export function ProjectDirectory({ projects }) {
  const [category, setCategory] = useState("Todos");
  const filtered = projects.filter(project => category === "Todos" || project.category === category);
  return <section className="container projectDirectory" aria-labelledby="directory-title">
    <p className="eyebrow">Explore por área</p>
    <h2 id="directory-title">Todos os projetos, de uma vez.</h2>
    <details className="projectDirectoryDetails">
      <summary>Explorar os {projects.length} projetos e filtrar por área</summary>
    <div className="projectFilters" role="group" aria-label="Filtrar projetos por área">
      {["Todos", "Front-end", "Back-end", "Full stack"].map(value => <button type="button" key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}
    </div>
    <p className="projectCount" role="status">{filtered.length} projetos</p>
    <ul className="projectDirectoryGrid">
      {filtered.map(project => <li key={project.slug}>
        <span className="eyebrow">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.subtitle}</p>
        <div className="directoryLinks">
          {project.hasCaseStudy && <Link href={`/projetos/${project.slug}`} prefetch={false}>Ler estudo de caso →</Link>}
          {project.site && <a href={project.site} target="_blank" rel="noreferrer" aria-label={`Abrir demonstração de ${project.title}`}>Demonstração ↗</a>}
          <a href={project.repository} target="_blank" rel="noreferrer" aria-label={`Código de ${project.title} no GitHub`}>Código ↗</a>
        </div>
      </li>)}
    </ul>
    </details>
  </section>;
}
