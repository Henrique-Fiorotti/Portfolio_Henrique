import Link from "next/link";
import { profile } from "@/data/portfolio";
import { resume } from "@/data/resume";

function ListSection({ title, items }) {
  return <section className="resumeSection">
    <h2>{title}</h2>
    <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
  </section>;
}

function ResumeItem({ title, subtitle, period, summary, details }) {
  return <article className="resumeItem">
    <div className="resumeItemHeader">
      <div>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {period && <span>{period}</span>}
    </div>
    {summary && <p className="resumeItemSummary">{summary}</p>}
    <ul>{details.map(detail => <li key={detail}>{detail}</li>)}</ul>
  </article>;
}

export default function Curriculo() {
  return <main className="resumePage">
    <div className="resumeToolbar">
      <Link href="/">← Voltar ao portfólio</Link>
      <span className="printHint">Use Ctrl+P para salvar em PDF</span>
    </div>

    <article className="resume">
      <header className="resumeHeader">
        <div>
          <p>Desenvolvimento de sistemas & suporte de TI</p>
          <h1>{profile.name}</h1>
        </div>
        <address>
          <a href={profile.phoneHref}>{profile.phone}</a>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </address>
      </header>

      <section className="resumeSection">
        <h2>Perfil profissional</h2>
        <p>{resume.objective}</p>
      </section>

      <section className="resumeSection">
        <h2>Experiência profissional</h2>
        {resume.professionalExperience.map(item => <ResumeItem
          key={`${item.company}-${item.role}`}
          title={item.role}
          subtitle={`${item.company} · ${item.location}`}
          period={item.period}
          summary={item.summary}
          details={item.details}
        />)}
      </section>

      <ListSection title="Formação acadêmica" items={resume.education} />

      <section className="resumeSection">
        <h2>Projeto técnico</h2>
        {resume.projects.map(project => <ResumeItem
          key={project.title}
          title={project.title}
          subtitle={project.meta}
          details={project.details}
        />)}
      </section>

      <section className="resumeSection resumeSkillsSection">
        <h2>Competências técnicas</h2>
        <div className="resumeSkillGroups">
          {resume.skillGroups.map(group => <div className="resumeSkillGroup" key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.items.join(" · ")}</p>
          </div>)}
        </div>
      </section>

      <div className="resumeColumns resumeColumnsCompact">
        <ListSection title="Cursos e certificações" items={resume.courses} />
        <ListSection title="Idiomas" items={resume.languages} />
      </div>
    </article>
  </main>;
}
