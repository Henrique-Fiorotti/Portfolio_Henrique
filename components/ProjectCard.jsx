"use client";

import { SkillPill } from "./SkillPill";
const playPreview = event => {
  const video = event.currentTarget.querySelector("video");
  if (video && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.play().catch(() => {});
};
const pausePreview = event => event.currentTarget.querySelector("video")?.pause();
export function ProjectCard({
  project,
  t
}) {
  const href = project.site ?? project.repository;
  return <article id={project.slug} className="panel projectCard" style={{
    "--project-accent": project.accent
  }}>
      <a className="projectMedia" href={href} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true" onMouseEnter={playPreview} onMouseLeave={pausePreview}>
        <img src={project.image} alt="" loading="lazy" decoding="async" />
        {project.video && <video src={project.video} muted loop playsInline preload="none" />}
      </a>
      <div className="projectContent">
        <div>
          <h3>{project.title}</h3>
          <p className="projectSubtitle">{project.subtitle}</p>
          <p>{project.description}</p>
        </div>
        <ul className="projectSkills" aria-label={t.technologies}>
          {project.technologies.map(technology => <li key={technology}><SkillPill name={technology} label={t.tech[technology]} /></li>)}
        </ul>
        <div className="projectActions">
          {project.site && <a className="button primary" href={project.site} target="_blank" rel="noreferrer">{t.viewProject}<span className="srOnly"> — {project.title} ({t.newTab})</span></a>}
          <a className="button secondary" href={project.repository} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="githubIcon">
              <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.51.47-3.16-.63-3.36-1.2-.11-.29-.6-1.2-1.03-1.44-.35-.2-.85-.7-.01-.71.79-.01 1.35.74 1.54 1.05.9 1.55 2.34 1.11 2.91.84.09-.67.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.27 2.75 1.05A9.34 9.34 0 0 1 12 6.87a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.76 0 3.93-2.34 4.8-4.56 5.06.36.32.67.93.67 1.89 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
            </svg>
            GitHub<span className="srOnly"> — {project.title} ({t.newTab})</span>
          </a>
        </div>
      </div>
    </article>;
}
