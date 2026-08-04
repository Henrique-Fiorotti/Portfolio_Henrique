export type Project = {
  slug: string;
  windowTitle: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video?: string;
  technologies: string[];
  site?: string;
  repository: string;
  accent: string;
};

export const profile = {
  name: "Henrique Fiorotti",
  email: "hberdoldifiorotti@gmail.com",
  github: "https://github.com/Henrique-Fiorotti",
  linkedin: "https://www.linkedin.com/in/henrique-berdoldi-fiorotti-4594bb291/",
  about:
    "Sou estudante de Técnico em Desenvolvimento de Sistemas pelo SENAI e atuo na automação de rotinas com Python e JavaScript. Desenvolvo soluções front-end e back-end, sempre buscando unir uma boa experiência visual a código organizado.",
};

export const skills = ["HTML", "CSS", "JavaScript", "Python", "PHP", "React", "Tailwind"];
export const tools = ["GitHub", "VS Code", "MySQL", "Excel", "Canva", "Illustrator", "Photoshop"];

export const projects: Project[] = [
  {
    slug: "orbis",
    windowTitle: "Orbis.exe",
    title: "ORBIS",
    subtitle: "Manutenção preditiva industrial, web, mobile e IoT",
    description:
      "Plataforma para monitoramento de máquinas e sensores, gestão de alertas e equipes, relatórios e assistência operacional por IA, com atualizações em tempo real.",
    image: "https://raw.githubusercontent.com/Henrique-Fiorotti/orbis/main/public/orbis_dashboard_hero.svg",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind", "Socket.IO", "IA"],
    site: "https://orbis-3td.com.br",
    repository: "https://github.com/Henrique-Fiorotti/orbis",
    accent: "#5e17eb",
  },
  {
    slug: "identidade-cultura",
    windowTitle: "Cultura.exe",
    title: "IDENTIDADE & CULTURA",
    subtitle: "Experiência institucional para Paula Sanchez",
    description:
      "Projeto web institucional publicado na Vercel, criado para apresentar identidade e cultura por meio de uma experiência visual acessível em diferentes dispositivos.",
    image: "https://opengraph.githubassets.com/portfolio/henrique-fiorotti/identidade-cultura-paula-sanchez",
    technologies: ["HTML", "CSS", "Design responsivo", "Vercel"],
    site: "https://identidade-cultura-paula-sanchez.vercel.app",
    repository: "https://github.com/Henrique-Fiorotti/identidade-cultura-paula-sanchez",
    accent: "#d85872",
  },
  {
    slug: "fastapi-rest-api",
    windowTitle: "FastAPI.exe",
    title: "USER MANAGEMENT API",
    subtitle: "API REST com arquitetura organizada",
    description:
      "API para gerenciamento de usuários com CRUD, validação via Pydantic, respostas seguras, tratamento de erros e documentação automática com Swagger e ReDoc.",
    image: "https://opengraph.githubassets.com/portfolio/henrique-fiorotti/fastapi-rest-api",
    technologies: ["Python", "FastAPI", "Pydantic", "REST API"],
    repository: "https://github.com/Henrique-Fiorotti/fastapi-rest-api",
    accent: "#009688",
  },
  {
    slug: "node-express-product-api",
    windowTitle: "Products-API.exe",
    title: "PRODUCT API",
    subtitle: "Consulta de produtos com Node.js",
    description:
      "API REST simples para consulta de produtos, desenvolvida como estudo prático de rotas, recursos HTTP e construção de serviços com Node.js e Express.",
    image: "https://opengraph.githubassets.com/portfolio/henrique-fiorotti/node-express-product-api",
    technologies: ["JavaScript", "Node.js", "Express", "REST API"],
    repository: "https://github.com/Henrique-Fiorotti/node-express-product-api",
    accent: "#43853d",
  },
  {
    slug: "hcg-auto",
    windowTitle: "HCG.exe",
    title: "HCG-AUTO",
    subtitle: "Sistema de reservas para concessionária",
    description:
      "Sistema de reservas online para uma concessionária especializada em carros japoneses, com criação de conta, autenticação e gerenciamento de reservas.",
    image: "/images/hcg.png",
    video: "/videos/nissan-kicks-transparente.webm",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "GitHub", "Canva"],
    site: "https://gpc186.github.io/Galeria_Brutalista/",
    repository: "https://github.com/Henrique-Fiorotti/hcg-auto",
    accent: "#e8399a",
  },
  {
    slug: "brutalist-gallery",
    windowTitle: "BTG.exe",
    title: "THE BRUTALIST GALLERY",
    subtitle: "Galeria digital brutalista",
    description:
      "Experimento visual inspirado no design brutalista, desenvolvido para explorar composição, tipografia e interações digitais marcantes.",
    image: "/images/btg.png",
    video: "/videos/logo-3d-rotacao-eixo-y.webm",
    technologies: ["HTML", "CSS", "JavaScript", "GitHub"],
    site: "https://henrique-fiorotti.github.io/Brutalist_Gallery/index.html",
    repository: "https://github.com/Henrique-Fiorotti/Brutalist_Gallery",
    accent: "#ff4b4b",
  },
  {
    slug: "leitzo",
    windowTitle: "Leitzo.exe",
    title: "Leitzo",
    subtitle: "E-commerce de chocolates artesanais",
    description:
      "Site de vendas especializado em chocolates artesanais, com experiência visual envolvente e uma interface adaptada a diferentes telas.",
    image: "/images/leitzo.png",
    video: "/videos/leitzo-logo-3d-rotacao.webm",
    technologies: ["HTML", "CSS", "JavaScript", "Tailwind", "Canva"],
    site: "https://henrique-fiorotti.github.io/Leitzo/",
    repository: "https://github.com/Henrique-Fiorotti/Leitzo",
    accent: "#a96b27",
  },
  {
    slug: "crud",
    windowTitle: "CRUD.exe",
    title: "CRUD TO-DO",
    subtitle: "Create · Read · Update · Delete",
    description:
      "Aplicação de lista de tarefas que reúne as quatro operações fundamentais de persistência em uma interface direta e funcional.",
    image: "/images/crud.png",
    video: "/videos/To-do (1).mp4",
    technologies: ["HTML", "CSS", "JavaScript", "GitHub"],
    repository: "https://github.com/Henrique-Fiorotti/CRUD_basic",
    accent: "#32ae36",
  },
];
