import { Footer } from "@/components/Footer";
import { CasinoProjectButton } from "@/components/CasinoProjectButton";
import { DecodeName } from "@/components/DecodeName";
import Grainient from "@/components/Grainient";
import FolderFloat from "@/components/FolderFloat";
import { Greeting } from "@/components/Greeting";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFolder } from "@/components/ProjectFolder";
import { ResumeSheet } from "@/components/ResumeSheet";
import { ResumeViewer } from "@/components/ResumeViewer";
import { SiteHeader } from "@/components/SiteHeader";
import { iconMap } from "@/components/SkillPill";
import { messages } from "@/data/i18n";
import { localize, profile, projects, skills, tools } from "@/data/portfolio";
import { resume as resumes } from "@/data/resume";
export default async function Home({
  params
}) {
  const {
    lang: locale
  } = await params;
  const t = messages[locale];
  const resume = resumes[locale];
  const cards = projects.map(project => ({
    ...project,
    subtitle: localize(project.subtitle, locale),
    description: localize(project.description, locale)
  }));
  const cardT = {
    viewProject: t.viewProject,
    newTab: t.newTab,
    technologies: t.technologies,
    tech: t.tech
  };
  return <>
    <Grainient style={{
      position: "fixed",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none"
    }} colors={["#12154a", "#1a1a31", "#1a1a31", "#1a1a31", "#1b1f5a"]} angle={47} flow={0.75} silk={0.21} grainAmount={0.12} scale={0.45} speed={0.15} saturation={0.92} variation={2} interactive={false} stir={0.7} clickSwirl={false} />
    <a className="skipLink" href="#conteudo">{t.skip}</a>
    <SiteHeader locale={locale} t={{
      navLabel: t.navLabel,
      home: t.home,
      nav: t.nav,
      language: t.language,
      close: t.resume.close
    }} />

    <main id="conteudo">
      <section id="top" className="container panel hero">
        <div className="portrait">
          <img src="/images/user.webp" alt="" width="800" height="800" fetchPriority="high" />
        </div>
        <div className="heroContent">
          <Greeting {...t.greeting} />
          <DecodeName />
          <p className="role">{t.role}</p>
          <div className="heroActions">
            <CasinoProjectButton {...t.casino} />
            <a className="button secondary" href="#sobre">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14m0 0 6-6m-6 6-6-6" />
              </svg>
              {t.aboutMe}
            </a>
          </div>
          <div className="socialLinks">
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
        </div>
      </section>

      <section id="projetos" className="container projectsSection">
        <div className="sectionHeading">
          <h2>{t.nav.projects}</h2>
          <p>{t.projectsIntro}</p>
        </div>
        <ProjectFolder label={t.nav.projects} hint={t.projectsHint} close={t.resume.close} projects={cards} t={cardT} />
        <div className="projectsGrid">{cards.map(project => <ProjectCard key={project.slug} project={project} t={cardT} />)}</div>
      </section>

      <section id="sobre" className="container panel aboutSection">
        <h2>{t.aboutTitle}</h2>
        <div>
          <p>{localize(profile.about, locale)}</p>
          <div className="toolGroups">
            {[[t.stack, skills], [t.tools, tools]].map(([label, list]) => <FolderFloat key={label} className="skillFolder" items={list.map(name => ({
              label: name,
              value: name,
              icon: iconMap[name] && `/images/${iconMap[name]}`
            }))} label={label} sublabel={`${list.slice(0, 3).join(" · ")} +${list.length - 3}`} spread={150} folderColor="var(--line)" frontColor="var(--panel)" paperColor="var(--lavender)" itemColor="var(--pill-surface)" itemTextColor="var(--ink)" labelColor="var(--ink)" />)}
          </div>
        </div>
      </section>

      <section id="curriculo" className="container resumeBlock">
        <div className="sectionHeading">
          <h2>{t.nav.resume}</h2>
        </div>
        <ResumeViewer sheet={<ResumeSheet t={t.resume} resume={resume} profile={profile} />} image={`/images/curriculo-${locale}.webp`} labels={{
          title: `${t.nav.resume} · ${profile.name}`,
          open: t.resume.open,
          close: t.resume.close,
          pdf: t.resume.pdf,
          approved: t.resume.approved,
          restore: t.resume.restore
        }} />
      </section>
    </main>

    <Footer t={t} />
  </>;
}
