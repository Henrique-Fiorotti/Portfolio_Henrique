"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ProjectsCarousel({ projects, children }) {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const timestampsRef = useRef([]);
  const horizontalTriggerRef = useRef(null);
  const activateRef = useRef(null);

  const goToProject = (index, immediate = false) => {
    activateRef.current?.();
    const behavior = immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    const ratio = projects.length > 1 ? index / (projects.length - 1) : 0;
    const trigger = horizontalTriggerRef.current;

    if (trigger) {
      window.scrollTo({
        top: trigger.start + (trigger.end - trigger.start) * ratio,
        behavior
      });
      return;
    }

    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTo({
        left: (viewport.scrollWidth - viewport.clientWidth) * ratio,
        behavior
      });
    }
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !sticky || !viewport || !track || !progress) return;

    const colorChannels = projects.map(project => {
      const hex = project.accent.replace("#", "");
      return [0, 2, 4].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16));
    });
    const updateProjectTheme = rawProgress => {
      const carouselProgress = Math.min(1, Math.max(0, rawProgress));
      const projectPosition = carouselProgress * (projects.length - 1);
      const fromIndex = Math.floor(projectPosition);
      const toIndex = Math.min(fromIndex + 1, projects.length - 1);
      const mix = projectPosition - fromIndex;
      const blendedColor = colorChannels[fromIndex].map((channel, index) =>
        Math.round(channel + (colorChannels[toIndex][index] - channel) * mix)
      );
      const activeIndex = Math.round(projectPosition);

      sticky.style.setProperty("--active-project-tint", `rgba(${blendedColor.join(", ")}, .12)`);
      progress.style.backgroundColor = `rgb(${blendedColor.join(", ")})`;
      gsap.set(progress, { scaleX: carouselProgress });
      timestampsRef.current.forEach((timestamp, index) => {
        timestamp?.classList.toggle("isActive", index === activeIndex);
        if (index === activeIndex) timestamp?.setAttribute("aria-current", "true");
        else timestamp?.removeAttribute("aria-current");
      });
    };

    let cleanup;
    const activate = () => {
      if (cleanup) return;
      updateProjectTheme(0);
      const media = gsap.matchMedia();
      const context = gsap.context(() => {
        media.add("(min-width: 851px) and (prefers-reduced-motion: no-preference)", () => {
          viewport.classList.add("hasHorizontalScroll");
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
              onEnter: () => sticky.classList.add("isThemeActive"),
              onEnterBack: () => sticky.classList.add("isThemeActive"),
              onLeave: () => sticky.classList.remove("isThemeActive"),
              onLeaveBack: () => sticky.classList.remove("isThemeActive"),
              onUpdate: self => {
                sticky.classList.toggle("isThemeActive", self.isActive);
                updateProjectTheme(self.progress);
              }
            }
          });
          horizontalTriggerRef.current = horizontalTween.scrollTrigger;

          return () => {
            viewport.classList.remove("hasHorizontalScroll");
            horizontalTriggerRef.current = null;
            horizontalTween.scrollTrigger?.kill();
            gsap.set(track, { clearProps: "transform" });
          };
        });

        media.add("(max-width: 850px), (prefers-reduced-motion: reduce)", () => {
          const mobileThemeTrigger = ScrollTrigger.create({
            trigger: section,
            start: "top 65%",
            end: "bottom 35%",
            onToggle: self => sticky.classList.toggle("isThemeActive", self.isActive)
          });
          const updateFromNativeScroll = () => {
            const maxScroll = viewport.scrollWidth - viewport.clientWidth;
            updateProjectTheme(maxScroll > 0 ? viewport.scrollLeft / maxScroll : 0);
          };

          viewport.addEventListener("scroll", updateFromNativeScroll, { passive: true });
          updateFromNativeScroll();
          return () => {
            mobileThemeTrigger.kill();
            viewport.removeEventListener("scroll", updateFromNativeScroll);
          };
        });
      }, section);

      cleanup = () => {
        sticky.classList.remove("isThemeActive");
        media.revert();
        context.revert();
      };
    };
    activateRef.current = activate;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      activate();
      observer.disconnect();
    }, { rootMargin: "600px 0px" });
    observer.observe(section);
    return () => {
      observer.disconnect();
      activateRef.current = null;
      cleanup?.();
    };
  }, [projects]);

  return <section ref={sectionRef} id="projetos" className="projectsSection">
      <div ref={stickyRef} className="projectsCarouselSticky">
        <div className="container projectsCarouselHeading">
          <div className="sectionHeading">
            <div><p className="eyebrow">Trabalhos selecionados</p><h2>Projetos</h2></div>
            <p>Role para explorar uma seleção de aplicações, experiências visuais e estudos de desenvolvimento.</p>
          </div>
          <div className="projectsCarouselMeta">
            <div className="projectsCarouselTimestamps" onKeyDown={event => {
              const current = timestampsRef.current.indexOf(document.activeElement);
              if (current < 0) return;
              const next = { ArrowLeft: Math.max(0, current - 1), ArrowRight: Math.min(projects.length - 1, current + 1), Home: 0, End: projects.length - 1 }[event.key];
              if (next === undefined) return;
              event.preventDefault();
              timestampsRef.current[next]?.focus({ preventScroll: true });
              goToProject(next, true);
            }} style={{
              gridTemplateColumns: `repeat(${projects.length}, minmax(0, 1fr))`
            }}>
              {projects.map((project, index) => <button
                ref={node => { timestampsRef.current[index] = node; }}
                className={`projectsCarouselTimestamp ${index === 0 ? "isActive" : ""}`}
                style={{ "--project-color": project.accent }}
                key={project.slug}
                type="button"
                aria-current={index === 0 ? "true" : undefined}
                aria-label={`Ir para o projeto ${index + 1}: ${project.title}`}
                onClick={() => goToProject(index)}
              >{String(index + 1).padStart(2, "0")}</button>)}
            </div>
            <div className="projectsCarouselProgress"><span ref={progressRef} /></div>
          </div>
        </div>

        <div ref={viewportRef} className="projectsCarouselViewport" onFocusCapture={event => {
          const slide = event.target.closest(".projectsCarouselSlide");
          if (!slide) return;
          const index = Array.from(trackRef.current.children).indexOf(slide);
          const bounds = slide.getBoundingClientRect();
          if (bounds.left < 0 || bounds.right > window.innerWidth) goToProject(index, true);
        }}>
          <div ref={trackRef} className="projectsCarouselTrack">
            {children}
          </div>
        </div>
      </div>
    </section>;
}
