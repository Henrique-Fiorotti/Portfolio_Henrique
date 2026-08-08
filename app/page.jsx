"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { Footer } from "@/components/Footer";
import { CasinoProjectButton } from "@/components/CasinoProjectButton";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillPill } from "@/components/SkillPill";
import { WindowLayoutControls, WindowLayoutProvider } from "@/components/WindowLayout";
import { Window } from "@/components/Window";
import { profile, projects, skills, tools } from "@/data/portfolio";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef(null);
  const loaderBrandRef = useRef(null);
  const loaderNameRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(TextPlugin);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => setIsLoading(false)
      });

      tl.set(loaderBrandRef.current, {
        left: "max(20px, calc((100vw - 1180px) / 2))",
        top: "25px",
        xPercent: 0,
        yPercent: 0,
        opacity: 0,
        scale: 0.8
      });

      tl.set(loaderNameRef.current, {
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        opacity: 1,
        scale: 1,
        text: "Henrique <span class='loaderAccent'>Fiorotti</span>"
      });

      tl.to(loaderNameRef.current, {
        duration: 1.25,
        scale: 1,
        opacity: 0.96,
        filter: "blur(0.1px)"
      });

      tl.to(loaderNameRef.current, {
        duration: 0.9,
        text: "<span class='loaderAccent'>H</span>F.",
        ease: "power3.out",
        onComplete: () => {
          gsap.to(loaderBrandRef.current, {
            duration: 0.7,
            opacity: 1,
            scale: 1,
            ease: "power2.out"
          });
        }
      }, "+=0.1");

      tl.to(loaderNameRef.current, {
        duration: 0.7,
        opacity: 0,
        scale: 0.2,
        ease: "power2.inOut"
      }, "+=0.3");

      tl.to(loaderRef.current, {
        duration: 0.7,
        autoAlpha: 0,
        ease: "power2.inOut",
        pointerEvents: "none"
      }, "+=0.2");
    });

    return () => ctx.revert();
  }, []);

  return <WindowLayoutProvider>
    <div ref={loaderRef} className={`loaderOverlay ${isLoading ? "isVisible" : "isHidden"}`} aria-live="polite" aria-label="Carregando portfólio">
      <span ref={loaderBrandRef} className="loaderBrand">HF<span>.</span></span>
      <span ref={loaderNameRef} className="loaderName">Henrique Fiorotti</span>
    </div>
    <main className={isLoading ? "siteContent isLoading" : "siteContent"}>
      <header className="siteHeader container">
        <a className="brand" href="#top">HF<span>.</span></a>
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
                <a className="button secondary" href={`mailto:${profile.email}`}>Entrar em contato</a>
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
              <h2>Curiosidade, código e atenção aos detalhes.</h2>
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
