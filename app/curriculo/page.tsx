import { profile } from "@/data/portfolio";
import { resume } from "@/data/resume";
import Link from "next/link";

function ListSection({ title, items }: { title: string; items: string[] }) {
  return <section className="resumeSection"><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

export default function Curriculo() {
  return (
    <main className="resumePage">
      <div className="resumeToolbar"><Link href="/">← Voltar ao portfólio</Link><span className="printHint">Use Ctrl+P para salvar em PDF</span></div>
      <article className="resume">
        <header className="resumeHeader">
          <div><p>Desenvolvedor de sistemas</p><h1>{profile.name}</h1></div>
          <address><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={profile.github}>GitHub</a><a href={profile.linkedin}>LinkedIn</a></address>
        </header>
        <section className="resumeSection"><h2>Objetivo</h2><p>{resume.objective}</p></section>
        <ListSection title="Formação acadêmica" items={resume.education} />
        <section className="resumeSection"><h2>Projetos pessoais</h2>{resume.experience.map((item) => <div className="resumeItem" key={item.title}><h3>{item.title}</h3><ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></div>)}</section>
        <ListSection title="Cursos e certificações" items={resume.courses} />
        <div className="resumeColumns"><ListSection title="Hard skills" items={resume.hardSkills} /><ListSection title="Soft skills" items={resume.softSkills} /><ListSection title="Idiomas" items={resume.languages} /></div>
      </article>
    </main>
  );
}
