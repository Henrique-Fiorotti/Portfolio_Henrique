"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Footer } from "@/components/Footer";
import { CasinoProjectButton } from "@/components/CasinoProjectButton";
import { ContactModal } from "@/components/ContactModal";
import { AnimatedAboutTitle } from "@/components/AnimatedAboutTitle";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillPill } from "@/components/SkillPill";
import { WindowLayoutControls, WindowLayoutProvider } from "@/components/WindowLayout";
import { Window } from "@/components/Window";
import { profile, projects, skills, tools } from "@/data/portfolio";

const LOADER_NAME = "Henrique Fiorotti";
const LOADER_INITIALS = new Set([0, LOADER_NAME.indexOf("F")]);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
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
          ease: "power2.out"
        }
      );

      tl.to(removableLetters, {
        duration: 0.13,
        autoAlpha: 0,
        y: -8,
        width: 0,
        scaleX: 0,
        stagger: 0.045,
        ease: "power2.in"
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
        ease: "back.out(2)"
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
        ease: "power3.inOut"
      }, "+=0.25");

      tl.to(loaderRef.current, {
        duration: 0.5,
        autoAlpha: 0,
        ease: "power2.inOut"
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
      <header className="siteHeader container">
        <a ref={siteBrandRef} className="brand" href="#top">HF<span>.</span></a>
        <div className="siteHeaderActions">
        <nav className="siteHeaderNav" aria-label="Navegação principal">
          <a className="navLink" href="#sobre">Sobre</a>
          <a className="navLink" href="#projetos">Projetos</a>
          <a className="navLink" href="/curriculo">Currículo</a>
        </nav>
        <WindowLayoutControls />
        </div>
      </header>

      <div id="top" className="container">
        <Window title="Portfolio.exe" className="heroWindow" interactive={false}>
          <section className="hero">
            <div className="portrait" aria-hidden="true">
              <img className="mb-20" src="/images/user.svg" alt="Henrique Fiorotti" />
            </div>
            <div className="heroContent">
              <p className="eyebrow">Opa, eu sou</p>
              <h1>Henrique<br /><span>Fiorotti</span></h1>
              <p className="role">Desenvolvedor de sistemas & criador de experiências digitais</p>
              <p className="heroText">Transformo ideias em interfaces responsivas, automações e aplicações web funcionais.</p>
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
            <div><h3>Hard skills</h3><div className="pillList">{skills.map(skill => <SkillPill key={skill} name={skill} />)}</div></div>
            <div><h3>Ferramentas</h3><div className="pillList">{tools.map(tool => <SkillPill key={tool} name={tool} />)}</div></div>
          </div>
        </Window>
      </section>

      <section id="projetos" className="container projectsSection">
        <div className="sectionHeading">
          <div><p className="eyebrow">Trabalhos selecionados</p><h2>Projetos</h2></div>
          <p>Uma seleção de aplicações, experiências visuais e estudos de desenvolvimento.</p>
        </div>
        <div className="projectsGrid">{projects.map(project => <ProjectCard key={project.slug} project={project} />)}</div>
      </section>

      <Footer />
    </main>
    </WindowLayoutProvider>;
}
