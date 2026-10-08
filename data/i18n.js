// pt is the source language; a browser in a language that is not listed falls back to en.
export const locales = ["pt", "en", "es", "fr", "de"];
export const localeNames = {
  pt: "Português",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch"
};
export const htmlLang = {
  pt: "pt-BR",
  en: "en",
  es: "es",
  fr: "fr",
  de: "de"
};
// Each language has its own URL; search engines are told about the others through hreflang.
export const alternatesFor = (path = "") => ({
  canonical: path,
  languages: {
    ...Object.fromEntries(locales.map(code => [htmlLang[code], `/${code}${path.replace(/^\/[a-z]{2}/, "")}`])),
    "x-default": "/"
  }
});
export const messages = {
  pt: {
    meta: {
      title: "Henrique Fiorotti | Desenvolvedor",
      description: "Portfólio de Henrique Fiorotti, desenvolvedor de sistemas com projetos em front-end, back-end e automação."
    },
    skip: "Pular para o conteúdo",
    navLabel: "Navegação principal",
    home: "Início",
    nav: {
      projects: "Projetos",
      about: "Sobre",
      resume: "Currículo",
      contact: "Contato"
    },
    language: "Idioma",
    greeting: {
      plain: "Opa, eu sou",
      morning: "Opa, bom dia! Eu sou",
      afternoon: "Opa, boa tarde! Eu sou",
      evening: "Opa, boa noite! Eu sou"
    },
    role: "Desenvolvedor de sistemas & criador de experiências digitais",
    heroText: "Transformo ideias em interfaces responsivas, automações e aplicações web funcionais.",
    casino: {
      label: "Conhecer Projetos",
      hover: "Sortear Projeto ✦",
      aria: "Sortear um projeto",
      drawn: "Projeto sorteado:"
    },
    viewResume: "Ver currículo",
    projectsIntro: "Uma seleção de aplicações, experiências visuais e estudos de desenvolvimento.",
    viewProject: "Ver projeto",
    newTab: "abre em nova aba",
    technologies: "Tecnologias utilizadas",
    tech: {},
    aboutTitle: "Curiosidade, código e atenção aos detalhes.",
    stack: "Stack",
    tools: "Ferramentas",
    footerTitle: "Tenho interesse em novos projetos e oportunidades.",
    copyHint: "clique para copiar",
    copied: "copiado ✓",
    footerNav: "Links do rodapé",
    sendEmail: "Enviar email",
    builtWith: "Desenvolvido com Next.js",
    console: "Opa! Curtiu o código? Então vamos conversar.",
    resume: {
      pdf: "Baixar PDF",
      objective: "Objetivo",
      education: "Formação acadêmica",
      experience: "Projetos pessoais",
      courses: "Cursos e certificações",
      hardSkills: "Hard skills",
      softSkills: "Soft skills",
      languages: "Idiomas"
    }
  },
  en: {
    meta: {
      title: "Henrique Fiorotti | Developer",
      description: "Portfolio of Henrique Fiorotti, a systems developer with front-end, back-end and automation projects."
    },
    skip: "Skip to content",
    navLabel: "Main navigation",
    home: "Home",
    nav: {
      projects: "Projects",
      about: "About",
      resume: "Résumé",
      contact: "Contact"
    },
    language: "Language",
    greeting: {
      plain: "Hey, I'm",
      morning: "Hey, good morning! I'm",
      afternoon: "Hey, good afternoon! I'm",
      evening: "Hey, good evening! I'm"
    },
    role: "Systems developer & digital experience creator",
    heroText: "I turn ideas into responsive interfaces, automations and working web applications.",
    casino: {
      label: "See Projects",
      hover: "Spin a Project ✦",
      aria: "Draw a random project",
      drawn: "Drawn project:"
    },
    viewResume: "View résumé",
    projectsIntro: "A selection of applications, visual experiences and development studies.",
    viewProject: "View project",
    newTab: "opens in a new tab",
    technologies: "Technologies used",
    tech: {
      "Design responsivo": "Responsive design",
      IA: "AI"
    },
    aboutTitle: "Curiosity, code and attention to detail.",
    stack: "Stack",
    tools: "Tools",
    footerTitle: "I'm open to new projects and opportunities.",
    copyHint: "click to copy",
    copied: "copied ✓",
    footerNav: "Footer links",
    sendEmail: "Send email",
    builtWith: "Built with Next.js",
    console: "Hey! Like the code? Let's talk.",
    resume: {
      pdf: "Download PDF (PT)",
      objective: "Objective",
      education: "Education",
      experience: "Personal projects",
      courses: "Courses and certifications",
      hardSkills: "Hard skills",
      softSkills: "Soft skills",
      languages: "Languages"
    }
  },
  es: {
    meta: {
      title: "Henrique Fiorotti | Desarrollador",
      description: "Portafolio de Henrique Fiorotti, desarrollador de sistemas con proyectos de front-end, back-end y automatización."
    },
    skip: "Saltar al contenido",
    navLabel: "Navegación principal",
    home: "Inicio",
    nav: {
      projects: "Proyectos",
      about: "Sobre mí",
      resume: "Currículum",
      contact: "Contacto"
    },
    language: "Idioma",
    greeting: {
      plain: "¡Hola! Soy",
      morning: "¡Hola, buenos días! Soy",
      afternoon: "¡Hola, buenas tardes! Soy",
      evening: "¡Hola, buenas noches! Soy"
    },
    role: "Desarrollador de sistemas y creador de experiencias digitales",
    heroText: "Transformo ideas en interfaces responsivas, automatizaciones y aplicaciones web funcionales.",
    casino: {
      label: "Ver Proyectos",
      hover: "Sortear Proyecto ✦",
      aria: "Sortear un proyecto",
      drawn: "Proyecto sorteado:"
    },
    viewResume: "Ver currículum",
    projectsIntro: "Una selección de aplicaciones, experiencias visuales y estudios de desarrollo.",
    viewProject: "Ver proyecto",
    newTab: "se abre en una pestaña nueva",
    technologies: "Tecnologías utilizadas",
    tech: {
      "Design responsivo": "Diseño responsivo"
    },
    aboutTitle: "Curiosidad, código y atención al detalle.",
    stack: "Stack",
    tools: "Herramientas",
    footerTitle: "Estoy abierto a nuevos proyectos y oportunidades.",
    copyHint: "haz clic para copiar",
    copied: "copiado ✓",
    footerNav: "Enlaces del pie de página",
    sendEmail: "Enviar email",
    builtWith: "Desarrollado con Next.js",
    console: "¡Hola! ¿Te gustó el código? Hablemos.",
    resume: {
      pdf: "Descargar PDF (PT)",
      objective: "Objetivo",
      education: "Formación académica",
      experience: "Proyectos personales",
      courses: "Cursos y certificaciones",
      hardSkills: "Habilidades técnicas",
      softSkills: "Habilidades blandas",
      languages: "Idiomas"
    }
  },
  fr: {
    meta: {
      title: "Henrique Fiorotti | Développeur",
      description: "Portfolio de Henrique Fiorotti, développeur de systèmes avec des projets front-end, back-end et d'automatisation."
    },
    skip: "Aller au contenu",
    navLabel: "Navigation principale",
    home: "Accueil",
    nav: {
      projects: "Projets",
      about: "À propos",
      resume: "CV",
      contact: "Contact"
    },
    language: "Langue",
    greeting: {
      plain: "Salut, je suis",
      morning: "Bonjour ! Je suis",
      afternoon: "Bonjour ! Je suis",
      evening: "Bonsoir ! Je suis"
    },
    role: "Développeur de systèmes et créateur d'expériences numériques",
    heroText: "Je transforme des idées en interfaces responsives, en automatisations et en applications web fonctionnelles.",
    casino: {
      label: "Voir les projets",
      hover: "Tirer un projet ✦",
      aria: "Tirer un projet au hasard",
      drawn: "Projet tiré :"
    },
    viewResume: "Voir le CV",
    projectsIntro: "Une sélection d'applications, d'expériences visuelles et d'études de développement.",
    viewProject: "Voir le projet",
    newTab: "s'ouvre dans un nouvel onglet",
    technologies: "Technologies utilisées",
    tech: {
      "Design responsivo": "Design responsive"
    },
    aboutTitle: "Curiosité, code et souci du détail.",
    stack: "Stack",
    tools: "Outils",
    footerTitle: "Je suis ouvert à de nouveaux projets et opportunités.",
    copyHint: "cliquez pour copier",
    copied: "copié ✓",
    footerNav: "Liens du pied de page",
    sendEmail: "Envoyer un e-mail",
    builtWith: "Développé avec Next.js",
    console: "Salut ! Le code vous plaît ? Parlons-en.",
    resume: {
      pdf: "Télécharger le PDF (PT)",
      objective: "Objectif",
      education: "Formation",
      experience: "Projets personnels",
      courses: "Cours et certifications",
      hardSkills: "Compétences techniques",
      softSkills: "Savoir-être",
      languages: "Langues"
    }
  },
  de: {
    meta: {
      title: "Henrique Fiorotti | Entwickler",
      description: "Portfolio von Henrique Fiorotti, Systementwickler mit Projekten in Front-End, Back-End und Automatisierung."
    },
    skip: "Zum Inhalt springen",
    navLabel: "Hauptnavigation",
    home: "Startseite",
    nav: {
      projects: "Projekte",
      about: "Über mich",
      resume: "Lebenslauf",
      contact: "Kontakt"
    },
    language: "Sprache",
    greeting: {
      plain: "Hallo, ich bin",
      morning: "Guten Morgen! Ich bin",
      afternoon: "Guten Tag! Ich bin",
      evening: "Guten Abend! Ich bin"
    },
    role: "Systementwickler & Gestalter digitaler Erlebnisse",
    heroText: "Ich verwandle Ideen in responsive Oberflächen, Automatisierungen und funktionierende Webanwendungen.",
    casino: {
      label: "Projekte ansehen",
      hover: "Projekt ziehen ✦",
      aria: "Zufälliges Projekt ziehen",
      drawn: "Gezogenes Projekt:"
    },
    viewResume: "Lebenslauf ansehen",
    projectsIntro: "Eine Auswahl an Anwendungen, visuellen Erlebnissen und Entwicklungsstudien.",
    viewProject: "Projekt ansehen",
    newTab: "öffnet in neuem Tab",
    technologies: "Verwendete Technologien",
    tech: {
      "Design responsivo": "Responsives Design",
      IA: "KI"
    },
    aboutTitle: "Neugier, Code und Liebe zum Detail.",
    stack: "Stack",
    tools: "Werkzeuge",
    footerTitle: "Ich bin offen für neue Projekte und Möglichkeiten.",
    copyHint: "zum Kopieren klicken",
    copied: "kopiert ✓",
    footerNav: "Footer-Links",
    sendEmail: "E-Mail senden",
    builtWith: "Entwickelt mit Next.js",
    console: "Hallo! Gefällt dir der Code? Lass uns reden.",
    resume: {
      pdf: "PDF herunterladen (PT)",
      objective: "Ziel",
      education: "Ausbildung",
      experience: "Persönliche Projekte",
      courses: "Kurse und Zertifikate",
      hardSkills: "Fachkenntnisse",
      softSkills: "Soziale Kompetenzen",
      languages: "Sprachen"
    }
  }
};
