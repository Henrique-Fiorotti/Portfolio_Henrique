import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/data/portfolio";
import { ProjectDetails } from "@/components/ProjectDetails";
import { siteUrl } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) return {};
  const title = `${project.title} — Projeto | Henrique Fiorotti`;
  return {
    title, description: project.subtitle,
    ...(siteUrl && { alternates: { canonical: new URL(`/projetos/${slug}`, siteUrl).href } }),
    openGraph: { title, description: project.subtitle, ...(siteUrl && { url: new URL(`/projetos/${slug}`, siteUrl).href }) },
  };
}

export default async function ProjectCase({ params }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  return <main id="conteudo" className="container casePage" tabIndex={-1}>
    <Link href="/#projetos">← Voltar ao portfólio</Link>
    <header>
      <p className="eyebrow">Contexto, contribuição e entrega</p>
      <h1>{project.title}</h1>
      <p className="caseLead">{project.subtitle}</p>
    </header>
    <Image className="caseImage" src={project.image} width={1200} height={720} sizes="(max-width: 900px) 92vw, 900px" alt={`Apresentação do projeto ${project.title}`} />
    <ProjectDetails project={project} />
  </main>;
}
