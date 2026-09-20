import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/data/portfolio";
import { caseStudies } from "@/data/case-studies";
import { StarStory } from "@/components/StarStory";
import { siteUrl } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(caseStudies).map(slug => ({ slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project || !caseStudies[slug]) return {};
  const title = `${project.title} — Estudo de caso | Henrique Fiorotti`;
  return {
    title, description: project.subtitle,
    ...(siteUrl && { alternates: { canonical: new URL(`/projetos/${slug}`, siteUrl).href } }),
    openGraph: { title, description: project.subtitle, ...(siteUrl && { url: new URL(`/projetos/${slug}`, siteUrl).href }) },
  };
}

export default async function ProjectCase({ params }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  const story = caseStudies[slug];
  if (!project || !story) notFound();
  return <main id="conteudo" className="container casePage" tabIndex={-1}>
    <Link href="/#estudos">← Voltar ao portfólio</Link>
    <header>
      <p className="eyebrow">{story.context}</p>
      <h1>{project.title}</h1>
      <p className="caseLead">{project.subtitle}</p>
      <p>{story.role}</p>
    </header>
    <Image className="caseImage" src={project.image} width={1200} height={720} sizes="(max-width: 900px) 92vw, 900px" alt={`Apresentação do projeto ${project.title}`} />
    <section aria-labelledby="story-title"><h2 id="story-title">Do contexto à entrega</h2><StarStory story={story.star} /></section>
    <section><h2>Implementação técnica</h2><ul>{story.decisions.map(decision => <li key={decision}>{decision}</li>)}</ul></section>
    <section><h2>Explore a entrega</h2><p>{story.evidence}</p><div className="directoryLinks">
      <a href={project.repository} target="_blank" rel="noreferrer">Ver código no GitHub ↗</a>
      {project.site && <a href={project.site} target="_blank" rel="noreferrer">Abrir demonstração ↗</a>}
    </div></section>
  </main>;
}
