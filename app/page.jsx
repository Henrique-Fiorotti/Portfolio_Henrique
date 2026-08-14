"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Footer } from "@/components/Footer";
import { CasinoProjectButton } from "@/components/CasinoProjectButton";
import { ContactModal } from "@/components/ContactModal";
import { AnimatedAboutTitle } from "@/components/AnimatedAboutTitle";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { SkillPill } from "@/components/SkillPill";
import { WindowLayoutControls, WindowLayoutProvider } from "@/components/WindowLayout";
import { Window } from "@/components/Window";
import { profile, projects, skills, tools } from "@/data/portfolio";
import { resume } from "@/data/resume";

const LOADER_NAME = "Henrique Fiorotti";
const LOADER_INITIALS = new Set([0, LOADER_NAME.indexOf("F")]);
const FEATURED_EXPERIENCE = resume.professionalExperience[0];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const loaderRef = useRef(null);
  const loaderNameRef = useRef(null);
  const loaderLettersRef = useRef([]);
  const loaderDotRef = useRef(null);
  const contentRef = useRef(null);
  const siteBrandRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const finishLoading = () => {
      document.body.style.overflow = previousOverflow;
      setIsLoading(false);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishLoading();
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    const ctx = gsap.context(() => {
      const letters = loaderLettersRef.current.filter(Boolean);
      const removableLetters = letters
        .filter((_, index) => !LOADER_INITIALS.has(index))
        .reverse();
      const logoRect = siteBrandRef.current.getBoundingClientRect();
      const logoStyle = window.getComputedStyle(siteBrandRef.current);
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: finishLoading
      });

      tl.set(loaderNameRef.current, { autoAlpha: 1 });
      tl.fromTo(letters,
        { autoAlpha: 0, y: 14, filter: "blur(5px)" },
        {
          duration: 0.24,
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.045,
          ease: "power2.out",
          force3D: true
        }
      );

      tl.to(removableLetters, {
        duration: 0.13,
        autoAlpha: 0,
        y: -8,
        width: 0,
        scaleX: 0,
        stagger: 0.045,
        ease: "power2.in",
        force3D: true,
        autoRound: false
      }, "+=0.5");

      tl.to(letters[LOADER_NAME.indexOf("F")], {
        duration: 0.2,
        color: "var(--ink)"
      }, "<");

      tl.to(loaderDotRef.current, {
        duration: 0.28,
        autoAlpha: 1,
        width: "auto",
        scale: 1,
        ease: "back.out(2)",
        force3D: true
      });

      tl.to(loaderNameRef.current, {
        duration: 0.75,
        left: logoRect.left,
        top: logoRect.top,
        xPercent: 0,
        yPercent: 0,
        fontSize: logoStyle.fontSize,
        fontWeight: logoStyle.fontWeight,
        letterSpacing: logoStyle.letterSpacing,
        ease: "power3.inOut",
        force3D: true,
        autoRound: false
      }, "+=0.25");

      tl.to(loaderRef.current, {
        duration: 0.5,
        autoAlpha: 0,
        ease: "power2.inOut",
        force3D: true
      }, "+=0.4");

      tl.to(contentRef.current, {
        duration: 0.5,
        opacity: 1,
        ease: "power2.out"
      }, "<");
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let frame = null;

    const updateHeader = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const difference = currentScrollY - previousScrollY;

      if (currentScrollY <= 24) {
        setIsHeaderHidden(false);
      } else if (Math.abs(difference) >= 6) {
        setIsHeaderHidden(difference > 0);
      }

      previousScrollY = currentScrollY;
      frame = null;
    };

    const handleScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateHeader);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <WindowLayoutProvider>
    <div ref={loaderRef} className={`loaderOverlay ${isLoading ? "isVisible" : "isHidden"}`} role="status" aria-live="polite" aria-label="Carregando portfólio" aria-hidden={!isLoading}>
      <span ref={loaderNameRef} className="loaderName" aria-hidden="true">
        {LOADER_NAME.split("").map((letter, index) => <span
          ref={node => { loaderLettersRef.current[index] = node; }}
          className={`loaderLetter ${index >= LOADER_NAME.indexOf("F") ? "loaderAccent" : ""}`}
          key={`${letter}-${index}`}
        >{letter}</span>)}
        <span ref={loaderDotRef} className="loaderDot">.</span>
      </span>
    </div>
    <main ref={contentRef} className={isLoading ? "siteContent isLoading" : "siteContent"} aria-busy={isLoading}>
      <header className={`siteHeader container ${isHeaderHidden ? "isHidden" : ""}`} aria-hidden={isHeaderHidden}>
        <a ref={siteBrandRef} className="brand" href="#top" aria-label="Henrique Fiorotti — voltar ao início">
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
          <a className="navLink" href="/curriculo">Currículo</a>
        </nav>
        <WindowLayoutControls />
        </div>
      </header>

      <div id="top" className="container mt-12">
        <Window title="Portfolio.exe" className="heroWindow" interactive={false}>
          <section className="hero">
            <div className="portrait" aria-hidden="true">
              <img className="mb-20" src="/images/user.svg" alt="Henrique Fiorotti" />
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
        <Window title="Sobre-mim.txt" interactive={false}>
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
        <Window title="experiencia.log" interactive={false}>
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
              <ul>
                {FEATURED_EXPERIENCE.details.slice(0, 3).map(detail => <li key={detail}>{detail}</li>)}
              </ul>
              <a className="experienceResumeLink" href="/curriculo">Ver currículo completo <span aria-hidden="true">→</span></a>
            </article>
          </div>
        </Window>
      </section>

      <ProjectsCarousel projects={projects} />

      <Footer />
    </main>
    </WindowLayoutProvider>;
}
