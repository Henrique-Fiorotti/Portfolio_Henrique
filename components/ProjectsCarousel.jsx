"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectCard } from "./ProjectCard";

export function ProjectsCarousel({ projects }) {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !sticky || !viewport || !track || !progress) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(min-width: 851px) and (prefers-reduced-motion: no-preference)", () => {
        const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        gsap.set(track, { x: 0 });
        gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
        const horizontalTween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: sticky,
            pinSpacing: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: self => gsap.set(progress, { scaleX: self.progress })
          }
        });

        return () => {
          horizontalTween.scrollTrigger?.kill();
          gsap.set(track, { clearProps: "transform" });
        };
      });
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return <section ref={sectionRef} id="projetos" className="projectsSection">
      <div ref={stickyRef} className="projectsCarouselSticky">
        <div className="container projectsCarouselHeading">
          <div className="sectionHeading">
            <div><p className="eyebrow">Trabalhos selecionados</p><h2>Projetos</h2></div>
            <p>Role para explorar uma seleção de aplicações, experiências visuais e estudos de desenvolvimento.</p>
          </div>
          <div className="projectsCarouselMeta" aria-hidden="true">
            <span>01</span>
            <div className="projectsCarouselProgress"><span ref={progressRef} /></div>
            <span>{String(projects.length).padStart(2, "0")}</span>
          </div>
        </div>

        <div ref={viewportRef} className="projectsCarouselViewport">
          <div ref={trackRef} className="projectsCarouselTrack">
            {projects.map((project, index) => <div className="projectsCarouselSlide" key={project.slug}>
                <span className="projectsCarouselIndex" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <ProjectCard project={project} />
              </div>)}
          </div>
        </div>
      </div>
    </section>;
}
