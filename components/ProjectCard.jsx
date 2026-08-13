"use client";

import { useRef } from "react";
import { SkillPill } from "./SkillPill";
import { Window } from "./Window";
export function ProjectCard({
  project
}) {
  const videoRef = useRef(null);
  const playPreview = () => videoRef.current?.play().catch(() => {});
  const pausePreview = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return <Window title={project.windowTitle} className="projectWindow" interactive={false}>
      <article className="projectCard" style={{
      "--accent": project.accent
    }}>
        <a className="projectMedia" href={project.site ?? project.repository} target="_blank" rel="noreferrer" aria-label={`Abrir ${project.title}`} onPointerEnter={playPreview} onPointerLeave={pausePreview} onFocus={playPreview} onBlur={pausePreview}>
          <img src={project.image} alt={`Prévia do projeto ${project.title}`} />
          {project.video && <video ref={videoRef} src={project.video} muted loop playsInline preload="metadata" aria-hidden="true" />}
        </a>
        <div className="projectContent">
          <div>
            <h3>{project.title}</h3>
            <p className="projectSubtitle">{project.subtitle}</p>
            <p>{project.description}</p>
          </div>
          <div className="projectSkills" aria-label="Tecnologias utilizadas">
            {project.technologies.map(technology => <SkillPill key={technology} name={technology} />)}
          </div>
          <div className="projectActions">
            {project.site && <a className="button primary" href={project.site} target="_blank" rel="noreferrer">Ver projeto</a>}
            <a className="button secondary githubRepositoryButton" href={project.repository} target="_blank" rel="noreferrer" aria-label="Repositório GitHub">
              <svg className="githubRepositoryIcon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.51.47-3.16-.63-3.36-1.2-.11-.29-.6-1.2-1.03-1.44-.35-.2-.85-.7-.01-.71.79-.01 1.35.74 1.54 1.05.9 1.55 2.34 1.11 2.91.84.09-.67.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.27 2.75 1.05A9.34 9.34 0 0 1 12 6.87a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.76 0 3.93-2.34 4.8-4.56 5.06.36.32.67.93.67 1.89 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
              </svg>
              <span className="githubRepositoryLabel">Repositório GitHub</span>
            </a>
          </div>
        </div>
      </article>
    </Window>;
}
