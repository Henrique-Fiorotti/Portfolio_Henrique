import { AnimatedCodeBackground } from "@/components/AnimatedCodeBackground";
import { Footer } from "@/components/Footer";
import { CasinoProjectButton } from "@/components/CasinoProjectButton";
import { DecodeName } from "@/components/DecodeName";
import { Greeting } from "@/components/Greeting";
import { ProjectCard } from "@/components/ProjectCard";
import { SiteHeader } from "@/components/SiteHeader";
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
  return <>
    <AnimatedCodeBackground />
    <a className="skipLink" href="#conteudo">{t.skip}</a>
    <SiteHeader locale={locale} t={{
      navLabel: t.navLabel,
      home: t.home,
      nav: t.nav,
      language: t.language
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
          <p className="heroText">{t.heroText}</p>
          <div className="heroActions">
            <CasinoProjectButton {...t.casino} />
            <a className="button secondary" href="#curriculo">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14m0 0 6-6m-6 6-6-6" />
              </svg>
              {t.viewResume}
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
        <div className="projectsGrid">{projects.map(project => <ProjectCard key={project.slug} project={{
            ...project,
            subtitle: localize(project.subtitle, locale),
            description: localize(project.description, locale)
          }} t={{
            viewProject: t.viewProject,
            newTab: t.newTab,
            technologies: t.technologies,
            tech: t.tech
          }} />)}</div>
      </section>

      <section id="sobre" className="container panel aboutSection">
        <h2>{t.aboutTitle}</h2>
        <div>
          <p>{localize(profile.about, locale)}</p>
          <dl className="stack">
            <dt>{t.stack}</dt><dd>{skills.join(" · ")}</dd>
            <dt>{t.tools}</dt><dd>{tools.join(" · ")}</dd>
          </dl>
        </div>
      </section>

      <section id="curriculo" className="container resumeBlock">
        <div className="sectionHeading">
          <h2>{t.nav.resume}</h2>
          <a className="button secondary" href="/curriculo-henrique-fiorotti.pdf" download="curriculo-henrique-fiorotti.pdf">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" />
            </svg>
            {t.resume.pdf}
          </a>
        </div>
        <div className="panel resumePanel">
          <div>
            <section><h3>{t.resume.objective}</h3><p>{resume.objective}</p></section>
            <section><h3>{t.resume.education}</h3><ul>{resume.education.map(item => <li key={item}>{item}</li>)}</ul></section>
            <section><h3>{t.resume.experience}</h3>{resume.experience.map(item => <div className="resumeItem" key={item.title}><h4>{item.title}</h4><ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>)}</section>
          </div>
          <div>
            <section><h3>{t.resume.courses}</h3><ul>{resume.courses.map(item => <li key={item}>{item}</li>)}</ul></section>
            <section><h3>{t.resume.hardSkills}</h3><ul>{resume.hardSkills.map(item => <li key={item}>{item}</li>)}</ul></section>
            <section><h3>{t.resume.softSkills}</h3><ul>{resume.softSkills.map(item => <li key={item}>{item}</li>)}</ul></section>
            <section><h3>{t.resume.languages}</h3><ul>{resume.languages.map(item => <li key={item}>{item}</li>)}</ul></section>
          </div>
        </div>
      </section>
    </main>

    <Footer t={t} />
  </>;
}
