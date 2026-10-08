// Text fields are either one string for every language or an object keyed by locale (see data/i18n.js).
export const localize = (value, locale) => typeof value === "string" ? value : value[locale] ?? value.pt;
export const profile = {
  name: "Henrique Fiorotti",
  email: "hberdoldifiorotti@gmail.com",
  github: "https://github.com/Henrique-Fiorotti",
  linkedin: "https://www.linkedin.com/in/henrique-berdoldi-fiorotti-4594bb291/",
  about: {
    pt: "Sou estudante de Técnico em Desenvolvimento de Sistemas pelo SENAI e atuo na automação de rotinas com Python e JavaScript. Desenvolvo soluções front-end e back-end, sempre buscando unir uma boa experiência visual a código organizado.",
    en: "I'm a Systems Development technical student at SENAI and I automate routines with Python and JavaScript. I build front-end and back-end solutions, always aiming to combine a good visual experience with well-organized code.",
    es: "Soy estudiante de Técnico en Desarrollo de Sistemas en el SENAI y trabajo en la automatización de rutinas con Python y JavaScript. Desarrollo soluciones front-end y back-end, buscando siempre unir una buena experiencia visual con código organizado.",
    fr: "Je suis en formation technique en développement de systèmes au SENAI et j'automatise des routines avec Python et JavaScript. Je développe des solutions front-end et back-end, en cherchant toujours à allier une bonne expérience visuelle à un code bien organisé.",
    de: "Ich mache eine technische Ausbildung in Systementwicklung am SENAI und automatisiere Routineaufgaben mit Python und JavaScript. Ich entwickle Front-End- und Back-End-Lösungen und verbinde dabei stets ein gutes visuelles Erlebnis mit sauber strukturiertem Code."
  }
};
export const skills = ["HTML", "CSS", "JavaScript", "Python", "PHP", "React", "Tailwind"];
export const tools = ["GitHub", "VS Code", "MySQL", "Excel", "Canva", "Illustrator", "Photoshop"];
export const projects = [{
  slug: "orbis",
  title: "ORBIS",
  subtitle: {
    pt: "Manutenção preditiva industrial, web, mobile e IoT",
    en: "Industrial predictive maintenance: web, mobile and IoT",
    es: "Mantenimiento predictivo industrial: web, móvil e IoT",
    fr: "Maintenance prédictive industrielle : web, mobile et IoT",
    de: "Industrielle vorausschauende Wartung: Web, Mobile und IoT"
  },
  description: {
    pt: "Plataforma para monitoramento de máquinas e sensores, gestão de alertas e equipes, relatórios e assistência operacional por IA, com atualizações em tempo real.",
    en: "Platform for monitoring machines and sensors, managing alerts and teams, reporting, and AI-assisted operations, with real-time updates.",
    es: "Plataforma para monitorear máquinas y sensores, gestionar alertas y equipos, generar informes y asistencia operativa con IA, con actualizaciones en tiempo real.",
    fr: "Plateforme de surveillance de machines et de capteurs, de gestion des alertes et des équipes, de rapports et d'assistance opérationnelle par IA, avec mises à jour en temps réel.",
    de: "Plattform zur Überwachung von Maschinen und Sensoren, zur Verwaltung von Alarmen und Teams, für Berichte und KI-gestützte Betriebsunterstützung – mit Echtzeit-Updates."
  },
  image: "/images/orbis.webp",
  technologies: ["Next.js", "React", "TypeScript", "Tailwind", "Socket.IO", "IA"],
  site: "https://orbis-3td.com.br",
  repository: "https://github.com/Henrique-Fiorotti/orbis",
  accent: "#5e17eb"
}, {
  slug: "identidade-cultura",
  title: "IDENTIDADE & CULTURA",
  subtitle: {
    pt: "Experiência institucional para Paula Sanchez",
    en: "Institutional experience for Paula Sanchez",
    es: "Experiencia institucional para Paula Sanchez",
    fr: "Expérience institutionnelle pour Paula Sanchez",
    de: "Institutioneller Auftritt für Paula Sanchez"
  },
  description: {
    pt: "Projeto web institucional publicado na Vercel, criado para apresentar identidade e cultura por meio de uma experiência visual acessível em diferentes dispositivos.",
    en: "Institutional website deployed on Vercel, built to present identity and culture through an accessible visual experience across devices.",
    es: "Sitio web institucional publicado en Vercel, creado para presentar identidad y cultura mediante una experiencia visual accesible en distintos dispositivos.",
    fr: "Site institutionnel publié sur Vercel, conçu pour présenter une identité et une culture à travers une expérience visuelle accessible sur tous les appareils.",
    de: "Institutionelle Website auf Vercel, die Identität und Kultur durch ein barrierearmes visuelles Erlebnis auf verschiedenen Geräten vermittelt."
  },
  image: "https://opengraph.githubassets.com/portfolio/henrique-fiorotti/identidade-cultura-paula-sanchez",
  technologies: ["HTML", "CSS", "Design responsivo", "Vercel"],
  site: "https://identidade-cultura-paula-sanchez.vercel.app",
  repository: "https://github.com/Henrique-Fiorotti/identidade-cultura-paula-sanchez",
  accent: "#d85872"
}, {
  slug: "fastapi-rest-api",
  title: "USER MANAGEMENT API",
  subtitle: {
    pt: "API REST com arquitetura organizada",
    en: "REST API with a clean architecture",
    es: "API REST con arquitectura organizada",
    fr: "API REST à l'architecture soignée",
    de: "REST-API mit sauberer Architektur"
  },
  description: {
    pt: "API para gerenciamento de usuários com CRUD, validação via Pydantic, respostas seguras, tratamento de erros e documentação automática com Swagger e ReDoc.",
    en: "User management API with CRUD, Pydantic validation, safe responses, error handling and automatic Swagger and ReDoc documentation.",
    es: "API de gestión de usuarios con CRUD, validación con Pydantic, respuestas seguras, manejo de errores y documentación automática con Swagger y ReDoc.",
    fr: "API de gestion des utilisateurs avec CRUD, validation Pydantic, réponses sécurisées, gestion des erreurs et documentation automatique avec Swagger et ReDoc.",
    de: "API zur Benutzerverwaltung mit CRUD, Pydantic-Validierung, sicheren Antworten, Fehlerbehandlung und automatischer Dokumentation mit Swagger und ReDoc."
  },
  image: "https://opengraph.githubassets.com/portfolio/henrique-fiorotti/fastapi-rest-api",
  technologies: ["Python", "FastAPI", "Pydantic", "REST API"],
  repository: "https://github.com/Henrique-Fiorotti/fastapi-rest-api",
  accent: "#009688"
}, {
  slug: "node-express-product-api",
  title: "PRODUCT API",
  subtitle: {
    pt: "Consulta de produtos com Node.js",
    en: "Product lookup with Node.js",
    es: "Consulta de productos con Node.js",
    fr: "Consultation de produits avec Node.js",
    de: "Produktabfrage mit Node.js"
  },
  description: {
    pt: "API REST simples para consulta de produtos, desenvolvida como estudo prático de rotas, recursos HTTP e construção de serviços com Node.js e Express.",
    en: "Simple REST API for looking up products, built as a hands-on study of routes, HTTP resources and building services with Node.js and Express.",
    es: "API REST sencilla para consultar productos, desarrollada como estudio práctico de rutas, recursos HTTP y creación de servicios con Node.js y Express.",
    fr: "API REST simple de consultation de produits, développée comme étude pratique des routes, des ressources HTTP et de la création de services avec Node.js et Express.",
    de: "Einfache REST-API zur Produktabfrage, entwickelt als Praxisstudie zu Routen, HTTP-Ressourcen und dem Aufbau von Services mit Node.js und Express."
  },
  image: "https://opengraph.githubassets.com/portfolio/henrique-fiorotti/node-express-product-api",
  technologies: ["JavaScript", "Node.js", "Express", "REST API"],
  repository: "https://github.com/Henrique-Fiorotti/node-express-product-api",
  accent: "#43853d"
}, {
  slug: "hcg-auto",
  title: "HCG-AUTO",
  subtitle: {
    pt: "Sistema de reservas para concessionária",
    en: "Booking system for a car dealership",
    es: "Sistema de reservas para concesionario",
    fr: "Système de réservation pour concessionnaire",
    de: "Reservierungssystem für ein Autohaus"
  },
  description: {
    pt: "Sistema de reservas online para uma concessionária especializada em carros japoneses, com criação de conta, autenticação e gerenciamento de reservas.",
    en: "Online booking system for a dealership specializing in Japanese cars, with sign-up, authentication and booking management.",
    es: "Sistema de reservas en línea para un concesionario especializado en autos japoneses, con creación de cuenta, autenticación y gestión de reservas.",
    fr: "Système de réservation en ligne pour un concessionnaire spécialisé dans les voitures japonaises, avec création de compte, authentification et gestion des réservations.",
    de: "Online-Reservierungssystem für ein auf japanische Autos spezialisiertes Autohaus, mit Kontoerstellung, Authentifizierung und Reservierungsverwaltung."
  },
  image: "/images/hcg.webp",
  video: "/videos/nissan-kicks-transparente.webm",
  technologies: ["HTML", "CSS", "JavaScript", "PHP", "GitHub", "Canva"],
  repository: "https://github.com/Henrique-Fiorotti/hcg-auto",
  accent: "#e8399a"
}, {
  slug: "brutalist-gallery",
  title: "THE BRUTALIST GALLERY",
  subtitle: {
    pt: "Galeria digital brutalista",
    en: "Brutalist digital gallery",
    es: "Galería digital brutalista",
    fr: "Galerie numérique brutaliste",
    de: "Brutalistische digitale Galerie"
  },
  description: {
    pt: "Experimento visual inspirado no design brutalista, desenvolvido para explorar composição, tipografia e interações digitais marcantes.",
    en: "Visual experiment inspired by brutalist design, built to explore composition, typography and striking digital interactions.",
    es: "Experimento visual inspirado en el diseño brutalista, desarrollado para explorar composición, tipografía e interacciones digitales llamativas.",
    fr: "Expérience visuelle inspirée du design brutaliste, créée pour explorer la composition, la typographie et des interactions numériques marquantes.",
    de: "Visuelles Experiment im Stil des Brutalismus, entwickelt, um Komposition, Typografie und markante digitale Interaktionen zu erkunden."
  },
  image: "/images/btg.webp",
  video: "/videos/logo-3d-rotacao-eixo-y.webm",
  technologies: ["HTML", "CSS", "JavaScript", "GitHub"],
  site: "https://henrique-fiorotti.github.io/Brutalist_Gallery/index.html",
  repository: "https://github.com/Henrique-Fiorotti/Brutalist_Gallery",
  accent: "#ff4b4b"
}, {
  slug: "leitzo",
  title: "Leitzo",
  subtitle: {
    pt: "E-commerce de chocolates artesanais",
    en: "E-commerce for artisanal chocolates",
    es: "E-commerce de chocolates artesanales",
    fr: "E-commerce de chocolats artisanaux",
    de: "E-Commerce für handgemachte Schokolade"
  },
  description: {
    pt: "Site de vendas especializado em chocolates artesanais, com experiência visual envolvente e uma interface adaptada a diferentes telas.",
    en: "Online store specializing in artisanal chocolates, with an engaging visual experience and an interface that adapts to any screen.",
    es: "Tienda en línea especializada en chocolates artesanales, con una experiencia visual atractiva y una interfaz adaptada a distintas pantallas.",
    fr: "Boutique en ligne spécialisée dans les chocolats artisanaux, avec une expérience visuelle immersive et une interface adaptée à tous les écrans.",
    de: "Onlineshop für handgemachte Schokolade mit einem ansprechenden visuellen Erlebnis und einer Oberfläche, die sich an jeden Bildschirm anpasst."
  },
  image: "/images/leitzo.webp",
  video: "/videos/leitzo-logo-3d-rotacao.webm",
  technologies: ["HTML", "CSS", "JavaScript", "Tailwind", "Canva"],
  site: "https://henrique-fiorotti.github.io/Leitzo/",
  repository: "https://github.com/Henrique-Fiorotti/Leitzo",
  accent: "#a96b27"
}, {
  slug: "crud",
  title: "CRUD TO-DO",
  subtitle: "Create · Read · Update · Delete",
  description: {
    pt: "Aplicação de lista de tarefas que reúne as quatro operações fundamentais de persistência em uma interface direta e funcional.",
    en: "To-do list app that brings together the four fundamental persistence operations in a direct, functional interface.",
    es: "Aplicación de lista de tareas que reúne las cuatro operaciones fundamentales de persistencia en una interfaz directa y funcional.",
    fr: "Application de liste de tâches réunissant les quatre opérations fondamentales de persistance dans une interface directe et fonctionnelle.",
    de: "To-do-App, die die vier grundlegenden Persistenzoperationen in einer direkten, funktionalen Oberfläche vereint."
  },
  image: "/images/crud.png",
  video: "/videos/todo.mp4",
  technologies: ["HTML", "CSS", "JavaScript", "GitHub"],
  repository: "https://github.com/Henrique-Fiorotti/CRUD_basic",
  accent: "#32ae36"
}];
