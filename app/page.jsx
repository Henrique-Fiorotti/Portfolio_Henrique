import { Footer } from "@/components/Footer";
import { CasinoProjectButton } from "@/components/CasinoProjectButton";
import { ContactModal } from "@/components/ContactModal";
import { AnimatedAboutTitle } from "@/components/AnimatedAboutTitle";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { SkillPill } from "@/components/SkillPill";
import { WindowLayoutControls } from "@/components/WindowLayout";
import Image from "next/image";
import Link from "next/link";
import portrait from "@/public/images/optimized/user.webp";
import { StaticWindow as Window } from "@/components/StaticWindow";
import { PortfolioExperience } from "@/components/PortfolioExperience";
import { SiteHeader } from "@/components/SiteHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { profile, projects, skills, tools } from "@/data/portfolio";
import { resume } from "@/data/resume";
import { siteUrl } from "@/lib/site";
import { StarStory } from "@/components/StarStory";

export const metadata = siteUrl ? { alternates: { canonical: siteUrl.href } } : {};

const FEATURED_EXPERIENCE = resume.professionalExperience[0];

export default function Home() {
  return <PortfolioExperience>
      <SiteHeader>
        <a className="brand" href="#top" aria-label="Henrique Fiorotti — voltar ao início">
          <span className="brandInitial" aria-hidden="true">H</span>
          <span className="brandExpansion brandExpansionFirst" aria-hidden="true">enrique&nbsp;</span>
          <span className="brandInitial" aria-hidden="true">F</span>
          <span className="brandExpansion brandExpansionLast" aria-hidden="true">iorotti</span>
          <span className="brandDot" aria-hidden="true">.</span>
        </a>
        <div className="siteHeaderActions">
        <nav className="siteHeaderNav" aria-label="Navegação principal">
          <a className="navLink" href="#sobre">Sobre</a>
          <a className="navLink" href="#projetos">Projetos</a>
          <Link className="navLink" href="/curriculo">Currículo</Link>
        </nav>
        <WindowLayoutControls />
        </div>
      </SiteHeader>

      <div id="top" className="container mt-12">
        <Window title="Portfolio.exe" className="heroWindow">
          <section className="hero">
            <div className="portrait" aria-hidden="true">
              <Image className="mb-20" src={portrait} alt="Henrique Fiorotti" sizes="(max-width: 850px) 80vw, 440px" loading="eager" fetchPriority="high" />
            </div>
            <div className="heroContent">
              <p className="eyebrow">Opa, eu sou</p>
              <h1>Henrique<br /><span>Fiorotti</span></h1>
              <p className="role">Desenvolvedor de sistemas & profissional de suporte de TI</p>
              <p className="heroText">Uno desenvolvimento web, suporte técnico e infraestrutura para criar soluções funcionais e resolver problemas reais.</p>
              <div className="heroActions">
                <CasinoProjectButton />
                <ContactModal />
                <a className="button secondary resumeDownloadButton" href="/curriculo-henrique-fiorotti.pdf" download="curriculo-henrique-fiorotti.pdf" aria-label="Baixar currículo PDF" data-tooltip="Baixar currí­culo PDF">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" />
                  </svg>
                </a>
              </div>
              <div className="socialLinks">
                <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              </div>
            </div>
          </section>
        </Window>
      </div>

      <section id="sobre" className="container aboutSection">
        <Window title="Sobre-mim.txt">
          <div className="aboutGrid">
            <div>
              <p className="eyebrow">Perfil</p>
              <AnimatedAboutTitle />
            </div>
            <p>{profile.about}</p>
          </div>
          <div className="skillColumns">
            <div><h3>Tecnologias</h3><div className="pillList">{skills.map(skill => <SkillPill key={skill} name={skill} />)}</div></div>
            <div><h3>Ferramentas & TI corporativo</h3><div className="pillList">{tools.map(tool => <SkillPill key={tool} name={tool} />)}</div></div>
          </div>
        </Window>
      </section>

      <section className="container experienceSection" aria-labelledby="experience-title">
        <Window title="experiencia.log">
          <div className="experienceContent">
            <div className="experienceHeading">
              <p className="eyebrow">Experiência profissional</p>
              <h2 id="experience-title">Suporte que resolve.<br /><span>Desenvolvimento que evolui.</span></h2>
            </div>
            <article className="experienceRole">
              <div className="experienceRoleMeta">
                <span>{FEATURED_EXPERIENCE.period}</span>
                <span>{FEATURED_EXPERIENCE.location}</span>
              </div>
              <h3>{FEATURED_EXPERIENCE.role}</h3>
              <p className="experienceCompany">{FEATURED_EXPERIENCE.company}</p>
              <p>{FEATURED_EXPERIENCE.summary}</p>
              <StarStory story={FEATURED_EXPERIENCE.star} />
              <Link className="experienceResumeLink" href="/curriculo">Ver currículo completo <span aria-hidden="true">→</span></Link>
            </article>
          </div>
        </Window>
      </section>

      <ProjectsCarousel projects={projects.map(({ slug, title, accent }) => ({ slug, title, accent }))}>
        {projects.map((project, index) => <div className="projectsCarouselSlide" key={project.slug}>
          <span className="projectsCarouselIndex" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <ProjectCard project={project} />
        </div>)}
      </ProjectsCarousel>

      <Footer />
  </PortfolioExperience>;
}
